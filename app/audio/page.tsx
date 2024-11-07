"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import MergeMidiButton from "@/components/MergeMidiButton";
import { AudioStorage, Stem } from "@/utils/types";
import { AudioContext } from "./AudioProvider";
import AudioForm from "./AudioForm";
import handleMidiConversion from "@/utils/getMidi";
import AudioMidiVisualizer from "@/components/AudioMidiVisualizer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MidiAdjustments from "@/components/MidiAdjustments";

export default function Page() {
  const { audioForm, audioStorage, setAudioStorage, songName } =
    useContext(AudioContext);
  const [flatScore, setFlatScore] = useState<string | null>(null);
  const [isMidiComplete, setIsMidiComplete] = useState(false);
  const flatRef = useRef<HTMLDivElement>(null);

  // Convert to Midi
  useEffect(() => {
    handleMidiConversion(
      audioStorage,
      setAudioStorage,
      audioForm.tempo as number,
    ).then((isComplete) => {
      if (isComplete) {
        setIsMidiComplete(true);
      }
    });
  }, [audioStorage]);

  // Create Flat Score
  useEffect(() => {
    const container = flatRef.current;
    if (!container || !flatScore) return;
    console.log("Creating Flat.io embed");
    import("flat-embed")
      .then(({ default: Embed }) => {
        new Embed(container, {
          score: flatScore,
          embedParams: {
            appId: process.env.NEXT_PUBLIC_FLAT_APP_ID,
            controlsPosition: "bottom",
          },
        });
      })
      .catch((error) => {
        console.error("Failed to load flat-embed:", error);
      });
  }, [flatScore]);

  // Warn user before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col justify-around">
      {!audioStorage && <AudioForm />}
      {audioStorage &&
        Object.entries(audioStorage as Record<keyof AudioStorage, Stem>).map(
          ([key, stem]) => {
            if (!stem.midiBlob) return;
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
                  <AccordionItem value="midi-adjustments">
                    <AccordionTrigger className="font-heading w-[300px] rounded-3xl border-2 border-border bg-accent px-6">
                      Midi Adjustments
                    </AccordionTrigger>
                    <AccordionContent className="rounded-3xl border-2 border-border bg-card px-6 dark:bg-stone-900">
                      <MidiAdjustments />
                    </AccordionContent>
                  </AccordionItem>
                  <div>
                    <AccordionItem
                      value="next"
                      className="button-secondary flex w-[300px] cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-border px-6 py-2 text-base font-semibold transition-colors"
                    >
                      Back <ArrowLeft className="size-4" />
                    </AccordionItem>
                    <AccordionItem
                      value="next"
                      className="button-primary mt-4 flex w-[300px] cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 text-base font-semibold transition-colors"
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
                </Accordion>
              </div>
            );
          },
        )}
      {/* {isMidiComplete && (
        <MergeMidiButton
          tempo={audioForm.tempo as number}
          audioStorage={audioStorage}
          songName={songName.current}
          setFlatScore={setFlatScore}
        />
      )} */}
      {flatScore && <div ref={flatRef} className="h-[75vh] w-full" />}
    </div>
  );
}
