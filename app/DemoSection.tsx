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

  return (
    <section
      id="demo"
      className="flex min-h-screen w-full flex-col items-center justify-start pt-12 max-lg:px-8 lg:pt-16 xl:pt-20"
    >
      <h1 className="text-2xl font-semibold leading-tight sm:text-3xl xl:text-4xl">
        See it in Action!
      </h1>
      <div className="mt-4 flex w-full flex-col items-start justify-center max-xl:max-w-[800px] lg:mt-8 xl:flex-row xl:space-x-12">
        {samples && (
          <AudioMidiVisualizer
            name={"Guitar"}
            audioBlob={samples.audioBlob}
            midiFile={samples.midiBlob as Blob}
            controls={[midiControls, originalAudioControls]}
            pageUpdate={false}
            isDemo={true}
            hideTitle={true}
          />
        )}
        <Accordion
          type="single"
          orientation="horizontal"
          defaultValue="audio-controls"
          className="mt-4 flex w-full flex-col justify-between max-xl:ml-0 max-xl:mt-8 max-xl:pb-20 xl:max-w-[300px]"
        >
          <div className="flex flex-col space-y-4 xl:justify-between">
            <AccordionItem
              value="audio-controls"
              className="rounded-3xl shadow-md"
            >
              <AccordionTrigger
                ref={audioControls}
                className="font-heading w-max rounded-3xl border-2 border-border bg-accent px-6 data-[state=open]:rounded-b-none xl:max-w-[300px]"
                hideChevron
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
