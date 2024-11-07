"use client";

import { useContext, useEffect, useRef, useState } from "react";
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

export default function MidiEditor() {
  const { audioStorage } = useContext(AudioContext);
  const midiAdjustments = useRef<HTMLDivElement>(null);
  const audioControls = useRef<HTMLDivElement>(null);
  const [controlsOpen, setControlsOpen] = useState(false);

  const handleOpen = (_event: React.MouseEvent<HTMLDivElement>) => {
    setTimeout(() => {
      if (!midiAdjustments.current || !audioControls.current) return;
      console.log(
        midiAdjustments.current.dataset.state,
        audioControls.current.dataset.state,
      );
      if (
        midiAdjustments.current.dataset.state === "open" ||
        audioControls.current.dataset.state === "open"
      ) {
        setControlsOpen(true);
      } else setControlsOpen(false);
    }, 50);
  };

  useEffect(() => {
    console.log("controlsOpen", controlsOpen);
  }, [controlsOpen]);

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
            <div className="flex flex-col space-y-4">
              <AccordionItem
                ref={midiAdjustments}
                onClick={handleOpen}
                value="midi-adjustments"
              >
                <AccordionTrigger className="font-heading w-[300px] rounded-3xl border-2 border-border bg-accent px-6">
                  Midi Adjustments
                </AccordionTrigger>
                <AccordionContent className="rounded-3xl border-2 border-border bg-card px-6 dark:bg-stone-900">
                  <MidiAdjustments />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                ref={audioControls}
                onClick={handleOpen}
                value="audio-controls"
              >
                <AccordionTrigger className="font-heading w-[300px] rounded-3xl border-2 border-border bg-accent px-6">
                  Audio Controls
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 rounded-3xl border-2 border-border bg-card px-6 dark:bg-stone-900">
                  audio
                </AccordionContent>
              </AccordionItem>
            </div>
            {!controlsOpen && (
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
