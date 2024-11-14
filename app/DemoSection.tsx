"use client";

import AudioMidiVisualizer from "@/components/AudioMidiVisualizer";
import AudioMixer from "@/components/AudioMixer";
import MidiAdjustments from "@/components/MidiAdjustments";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import getSamples from "@/utils/getSamples";
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

export default function DemoSection() {
  const [samples, setSamples] = useState<{
    audioBlob: Blob;
    midiBlob: Blob;
  } | null>(null);
  const [selectedMidi, setSelectedMidi] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageUpdate, setPageUpdate] = useState(false);
  const [midiOpen, setMidiOpen] = useState(false);

  const midiAdjustments = useRef<HTMLButtonElement>(null);
  const audioControls = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!samples) {
      getSamples().then((res) => {
        setSamples({
          audioBlob: res.audioblob,
          midiBlob: res.midiblob,
        });
      });
    }
  }, []);

  const handleOpen: MouseEventHandler<HTMLButtonElement> = (_event) => {
    setTimeout(() => {
      if (!midiAdjustments.current || !audioControls.current) return;
      if (midiAdjustments.current.dataset.state === "open") setMidiOpen(true);
      else setMidiOpen(false);
    }, 50);
  };

  const handleRegenerateMidi: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log("regeneration station babyyyy");
  };

  return (
    <section
      id="demo"
      className="flex h-[120vh] w-screen flex-col items-center justify-start pt-12 sm:w-[calc(100vw-12px)] lg:pt-16 xl:pt-20"
    >
      <h1 className="text-2xl font-semibold leading-tight sm:text-3xl xl:text-4xl">
        Try it Out!
      </h1>
      <div className="flex w-full flex-col items-start justify-center max-xl:max-w-[800px] xl:flex-row xl:space-x-12">
        {samples && (
          <AudioMidiVisualizer
            name={"Guitar"}
            audioBlob={samples.audioBlob}
            midiFile={samples.midiBlob as Blob}
            controls={[midiControls, originalAudioControls]}
            pageUpdate={pageUpdate}
          />
        )}
        <Accordion
          type="single"
          orientation="horizontal"
          className="flex w-full flex-col justify-between max-xl:ml-0 max-xl:mt-8 xl:h-[565.6px] xl:max-w-[300px]"
          collapsible
        >
          <div
            className={`flex flex-col space-y-4 xl:justify-between ${midiOpen ? "justify-between xl:h-[565.6px]" : "justify-normal"}`}
          >
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
        </Accordion>
      </div>
    </section>
  );
}
