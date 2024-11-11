"use client";

import {
  Dispatch,
  FormEventHandler,
  forwardRef,
  MouseEventHandler,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AudioContext } from "./AudioProvider";
import { useToast } from "@/hooks/use-toast";
import { createScore } from "@/utils/flat";
import { convertToMidi } from "@/utils/getMidi";
import mergeMidi from "@/utils/mergeMidi";
import { AudioStorage, midiAdjustments, Stem } from "@/utils/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AudioMidiVisualizer from "@/components/AudioMidiVisualizer";
import MidiAdjustments from "@/components/MidiAdjustments";
import AudioMixer from "@/components/AudioMixer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  conversionFlag: Dispatch<SetStateAction<boolean>>;
  isMidiComplete: boolean;
  setFlatScore: Dispatch<SetStateAction<string | null>>;
}

const MidiEditor = forwardRef(
  (
    { conversionFlag, isMidiComplete, setFlatScore }: Props,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const {
      audioStorage,
      setAudioStorage,
      audioForm,
      songName,
      finalMidiFile,
      songKey,
    } = useContext(AudioContext);
    const [selectedMidi, setSelectedMidi] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [midiOpen, setMidiOpen] = useState(false);
    const { toast } = useToast();

    const midiAdjustments = useRef<HTMLButtonElement>(null);
    const audioControls = useRef<HTMLButtonElement>(null);
    const message = useRef<string | null>(null);

    const [midiVolume, setMidiVolume] = useState(50);
    const [midiPan, setMidiPan] = useState(0);
    const midiControls = {
      volume: midiVolume,
      setVolume: setMidiVolume,
      pan: midiPan,
      setPan: setMidiPan,
    };

    const [audioVolume, setAudioVolume] = useState(50);
    const [audioPan, setAudioPan] = useState(0);
    const originalAudioControls = {
      volume: audioVolume,
      setVolume: setAudioVolume,
      pan: audioPan,
      setPan: setAudioPan,
    };

    const storageArray = Object.entries(
      audioStorage as Record<keyof AudioStorage, Stem>,
    );
    const key = storageArray[selectedMidi][0];
    const isDrums = key === "drums";
    const isLastKey = selectedMidi === storageArray.length - 1;
    const isFirstKey = selectedMidi === 0;
    const stem = (audioStorage as Record<keyof AudioStorage, Stem>)[
      key as keyof AudioStorage
    ];

    const handleOpen: MouseEventHandler<HTMLButtonElement> = (_event) => {
      setTimeout(() => {
        if (!midiAdjustments.current || !audioControls.current) return;
        if (midiAdjustments.current.dataset.state === "open") setMidiOpen(true);
        else setMidiOpen(false);
      }, 50);
    };

    const handleRegenerateMidi: FormEventHandler<HTMLFormElement> = async (
      e,
    ) => {
      e.preventDefault();
      conversionFlag(true);

      setAudioStorage((prev) => {
        if (!prev) return prev;
        const updatedStorage: AudioStorage = { ...prev };
        const name = stem.name;
        updatedStorage[name] = {
          ...updatedStorage[name],
          midiBlob: null,
        };

        return updatedStorage;
      });

      const formData = new FormData(e.currentTarget);
      const adjustments: midiAdjustments = {
        onset_threshold: formData.get("note_segmentation") as string,
        frame_threshold: formData.get("confidence_threshold") as string,
        minimum_note_length: formData.get("minimum_note_length") as string,
      };
      const maxFreq = parseInt(formData.get("maximum_frequency") as string);
      if (maxFreq < 18000) {
        adjustments.maximum_frequency = maxFreq.toString();
      }
      const minFreq = parseInt(formData.get("minimum_frequency") as string);
      if (minFreq > 0) {
        adjustments.minimum_frequency = minFreq.toString();
      }

      const newMidi = await convertToMidi(
        stem,
        audioForm.tempo as number,
        false,
        adjustments,
      );

      setAudioStorage((prev) => {
        if (!prev) return prev;
        const updatedStorage: AudioStorage = { ...prev };
        const name = stem.name;
        updatedStorage[name] = {
          ...updatedStorage[name],
          midiBlob: newMidi,
        };

        return updatedStorage;
      });
      conversionFlag(false);
    };

    const startMerge = async () => {
      setIsSubmitting(true);
      message.current = null;
      if (!audioStorage) {
        message.current = "No audio tracks to merge.";
        setIsSubmitting(false);
        return;
      }

      try {
        const names = Object.keys(audioStorage);

        const midiFiles = await Promise.all(
          Object.entries(audioStorage as Record<keyof AudioStorage, Stem>).map(
            async ([_, stem]) => {
              const stemMidi = stem.midiBlob as Blob;
              return (await stemMidi.arrayBuffer()) as ArrayBuffer;
            },
          ),
        );

        const { combinedMidiBuffer, key } = await mergeMidi(
          midiFiles,
          audioForm.tempo as number,
          names,
          songName.current,
        );
        finalMidiFile.current = combinedMidiBuffer;
        songKey.current = key;
        const blob = new Blob([finalMidiFile.current], {
          type: "application/octet-stream",
        });
        console.log("creating flat score...");
        const response = await createScore(blob, songName.current);
        setFlatScore(response.id);

        // **For Testing: Download the merged MIDI file**
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = "TranscribedSong.mid";
        // a.click();
        // URL.revokeObjectURL(url);
      } catch (error) {
        message.current = "Failed to merge midi files.";
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    };

    useEffect(() => {
      if (message.current) {
        toast({
          variant: "destructive",
          title: "Whoops! Error Creating Score",
          description: message.current,
        });
      }
    }, [message.current]);

    return (
      <div
        ref={ref}
        className="flex w-full flex-col items-start justify-center max-xl:max-w-[800px] xl:flex-row xl:space-x-12"
      >
        <AudioMidiVisualizer
          name={stem.name}
          audioBlob={stem.audioBlob}
          midiFile={stem.midiBlob as Blob}
          controls={[midiControls, originalAudioControls]}
        />
        <Accordion
          type="single"
          orientation="horizontal"
          className="flex w-full flex-col justify-between max-xl:ml-0 max-xl:mt-8 xl:h-[565.6px] xl:max-w-[300px]"
          collapsible
        >
          <div
            className={`flex flex-col space-y-4 xl:justify-between ${midiOpen ? "justify-between xl:h-[565.6px]" : "justify-normal"}`}
          >
            {!isDrums && (
              <AccordionItem
                value="midi-adjustments"
                className="rounded-3xl shadow-md"
              >
                <AccordionTrigger
                  ref={midiAdjustments}
                  onClick={handleOpen}
                  className="font-heading w-full rounded-3xl border-2 border-border bg-accent px-6 data-[state=open]:rounded-b-none"
                >
                  Midi Adjustments
                </AccordionTrigger>
                <AccordionContent className="rounded-b-3xl border-2 border-t-0 border-border bg-stone-200 px-6 dark:bg-popover">
                  <MidiAdjustments handleSubmit={handleRegenerateMidi} />
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem
              value="audio-controls"
              className="rounded-3xl shadow-md"
            >
              <AccordionTrigger
                ref={audioControls}
                onClick={handleOpen}
                className="font-heading w-max rounded-3xl border-2 border-border bg-accent px-6 data-[state=open]:rounded-b-none xl:max-w-[300px]"
              >
                Audio Controls
              </AccordionTrigger>
              <AccordionContent className="flex h-72 flex-row items-center justify-around gap-4 rounded-b-3xl border-2 border-t-0 border-border bg-card px-6 dark:bg-popover">
                <AudioMixer name="Midi" controls={midiControls} />
                <AudioMixer name="Original" controls={originalAudioControls} />
              </AccordionContent>
            </AccordionItem>
          </div>
          {!midiOpen && (
            <div className="flex flex-row max-xl:mt-4 max-xl:items-center max-xl:justify-center max-xl:space-x-8 xl:flex-col xl:space-y-4">
              {!isFirstKey && (
                <AccordionItem
                  value="back"
                  onClick={() => setSelectedMidi(selectedMidi - 1)}
                  className="button-secondary flex h-min w-full cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-border px-6 py-2 text-base shadow-md transition-colors xl:max-w-[300px]"
                >
                  Back <ArrowLeft className="size-4" />
                </AccordionItem>
              )}
              {!isLastKey ? (
                <AccordionItem
                  value="next"
                  onClick={() => setSelectedMidi(selectedMidi + 1)}
                  className="button-primary flex h-min w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 text-base shadow-md transition-colors xl:max-w-[300px]"
                >
                  Next <ArrowRight className="size-4" />
                </AccordionItem>
              ) : (
                <AccordionItem
                  value="export"
                  aria-disabled={!isMidiComplete}
                  onClick={() => {
                    if (!isMidiComplete) return;
                    startMerge();
                  }}
                  className={`flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-2 text-base shadow-md transition-colors xl:max-w-[300px] ${isMidiComplete ? "button-action cursor-pointer" : "button-action-disabled cursor-default"}`}
                >
                  {!isSubmitting ? "Export" : "Exporting..."}
                </AccordionItem>
              )}
            </div>
          )}
        </Accordion>
      </div>
    );
  },
);

export default MidiEditor;
