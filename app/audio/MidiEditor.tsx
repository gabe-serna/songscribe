"use client";

import {
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AudioContext } from "./AudioProvider";
import { AudioStorage, Stem } from "@/utils/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AudioMidiVisualizer from "@/components/AudioMidiVisualizer";
import MidiAdjustments from "@/components/MidiAdjustments";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { runInContext } from "vm";
import { Label } from "@/components/ui/label";
import AudioMixer from "@/components/AudioMixer";
import { Arc, Knob, Pointer, Value } from "rc-knob";

export default function MidiEditor() {
  const { audioStorage } = useContext(AudioContext);
  const midiAdjustments = useRef<HTMLButtonElement>(null);
  const audioControls = useRef<HTMLButtonElement>(null);
  const [midiOpen, setMidiOpen] = useState(false);
  // const [controlsOpen, setControlsOpen] = useState(false);

  const handleOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setTimeout(() => {
      if (!midiAdjustments.current || !audioControls.current) return;
      // if (
      //   midiAdjustments.current.dataset.state === "open" ||
      //   audioControls.current.dataset.state === "open"
      // ) {
      //   setControlsOpen(true);
      // } else setControlsOpen(false);

      if (midiAdjustments.current.dataset.state === "open") setMidiOpen(true);
      else setMidiOpen(false);
    }, 50);
  };

  return Object.entries(audioStorage as Record<keyof AudioStorage, Stem>).map(
    ([key, stem]) => {
      if (!stem.midiBlob) return;
      // add key
      return (
        <div className="flex w-min items-start justify-center space-x-12">
          <AudioMidiVisualizer
            key={key}
            name={stem.name}
            audioBlob={stem.audioBlob}
            midiFile={stem.midiBlob}
          />
          <Accordion
            type="single"
            className="flex h-[565.6px] flex-col justify-between"
            collapsible
          >
            <div
              className={`flex flex-col justify-between space-y-4 ${midiOpen ? "h-[565.6px]" : ""}`}
            >
              <AccordionItem value="midi-adjustments">
                <AccordionTrigger
                  ref={midiAdjustments}
                  onClick={handleOpen}
                  className="font-heading w-[300px] rounded-3xl border-2 border-border bg-accent px-6 data-[state=open]:rounded-b-none"
                >
                  Midi Adjustments
                </AccordionTrigger>
                <AccordionContent className="rounded-b-3xl border-2 border-t-0 border-border bg-card px-6 dark:bg-stone-900">
                  <MidiAdjustments />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="audio-controls">
                <AccordionTrigger
                  ref={audioControls}
                  onClick={handleOpen}
                  className="font-heading w-[300px] rounded-3xl border-2 border-border bg-accent px-6 data-[state=open]:rounded-b-none"
                >
                  Audio Controls
                </AccordionTrigger>
                <AccordionContent className="flex h-72 flex-col gap-4 rounded-b-3xl border-2 border-t-0 border-border bg-card px-6 dark:bg-stone-900">
                  <AudioMixer name="Midi Audio" />
                  <Knob
                    size={100}
                    angleOffset={220}
                    angleRange={280}
                    steps={10}
                    snap={true}
                    min={0}
                    max={100}
                    // onChange={(value) => console.log(value)}
                  >
                    <Arc arcWidth={5} color="#FC5A96" radius={47.5} />
                    <Pointer
                      width={5}
                      radius={40}
                      type="circle"
                      color="#FC5A96"
                    />
                    <Value marginBottom={40} className="value" />
                  </Knob>
                </AccordionContent>
              </AccordionItem>
            </div>
            {!midiOpen && (
              <div className="flex flex-col space-y-4">
                <AccordionItem
                  value="next"
                  className="button-secondary flex w-[300px] cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-border px-6 py-2 text-base font-semibold transition-colors"
                >
                  Back <ArrowLeft className="size-4" />
                </AccordionItem>
                <AccordionItem
                  value="next"
                  className="button-primary flex w-[300px] cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 text-base font-semibold transition-colors"
                >
                  Next <ArrowRight className="size-4" />
                </AccordionItem>
                {/* <AccordionItem
                value="next"
                className="mt-4 flex w-[300px] cursor-pointer items-center justify-center gap-2 rounded-3xl bg-yellow-400 px-6 py-2 text-base font-semibold text-foreground dark:bg-yellow-600 dark:text-background"
              >
                Export
              </AccordionItem> */}
              </div>
            )}
          </Accordion>
        </div>
      );
    },
  );
}
