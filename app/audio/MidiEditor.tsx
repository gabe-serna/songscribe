"use client";

import {
  Dispatch,
  FormEventHandler,
  forwardRef,
  MouseEventHandler,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { AudioContext } from "./AudioProvider";
import { AudioStorage, midiAdjustments, Stem } from "@/utils/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AudioMidiVisualizer from "@/components/AudioMidiVisualizer";
import MidiAdjustments from "@/components/MidiAdjustments";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AudioMixer from "@/components/AudioMixer";
import { convertToMidi } from "@/utils/getMidi";

interface Props {
  conversionFlag: Dispatch<SetStateAction<boolean>>;
}

const MidiEditor = forwardRef(
  ({ conversionFlag }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { audioStorage, setAudioStorage, audioForm } =
      useContext(AudioContext);
    const [selectedMidi, setSelectedMidi] = useState<number>(0);
    const midiAdjustments = useRef<HTMLButtonElement>(null);
    const audioControls = useRef<HTMLButtonElement>(null);
    const [midiOpen, setMidiOpen] = useState(false);

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
              <AccordionItem value="midi-adjustments">
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
            <AccordionItem value="audio-controls">
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
                  className="button-secondary flex h-min w-full cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-border px-6 py-2 text-base transition-colors xl:max-w-[300px]"
                >
                  Back <ArrowLeft className="size-4" />
                </AccordionItem>
              )}
              {!isLastKey ? (
                <AccordionItem
                  value="next"
                  onClick={() => setSelectedMidi(selectedMidi + 1)}
                  className="button-primary flex h-min w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 text-base transition-colors xl:max-w-[300px]"
                >
                  Next <ArrowRight className="size-4" />
                </AccordionItem>
              ) : (
                <AccordionItem
                  value="export"
                  className="button-action flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 text-base xl:max-w-[300px]"
                >
                  Export
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
