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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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
    <div className="flex w-min flex-col justify-around">
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
                  className="mt-12 flex h-[517.6px] flex-col justify-between"
                  collapsible
                >
                  <AccordionItem value="midi-adjustments">
                    <AccordionTrigger className="font-heading w-[300px] rounded-3xl border-2 border-border bg-accent px-6">
                      Midi Adjustments
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 rounded-3xl border-2 border-border bg-input px-6 dark:bg-stone-900">
                      <form>
                        <Label htmlFor="note_length">Minimum Note Length</Label>
                        <div className="flex h-max items-center justify-center gap-4 *:mt-1">
                          <Slider
                            name="note_length"
                            defaultValue={[130]}
                            max={500}
                            min={0}
                            step={20}
                          />
                          <p className="text-stone-400">130</p>
                        </div>
                      </form>
                      <form>
                        <Label htmlFor="minimum_frequency">
                          Minimum Frequency
                        </Label>
                        <div className="flex h-max items-center justify-center gap-4 *:mt-1">
                          <Slider
                            name="minimum_frequency"
                            defaultValue={[0]}
                            max={5000}
                            min={0}
                            step={100}
                          />
                          <p className="text-stone-400">0</p>
                        </div>
                      </form>
                      <form>
                        <Label htmlFor="maximum_frequency">
                          Maximum Frequency
                        </Label>
                        <div className="flex h-max items-center justify-center gap-4 *:mt-1">
                          <Slider
                            name="maximum_frequency"
                            defaultValue={[18000]}
                            max={18000}
                            min={8000}
                            step={200}
                          />
                          <p className="text-stone-400">1800</p>
                        </div>
                      </form>
                      <form>
                        <Label htmlFor="note_segmentation">
                          Note Segmentation
                        </Label>
                        <div className="flex h-max items-center justify-center gap-4 *:mt-1">
                          <Slider
                            name="note_segmentation"
                            defaultValue={[0.5]}
                            max={0.95}
                            min={0.05}
                            step={0.05}
                          />
                          <p className="text-stone-400">1800</p>
                        </div>
                      </form>
                      <form>
                        <Label htmlFor="confidence_threshold">
                          Note Segmentation
                        </Label>
                        <div className="flex h-max items-center justify-center gap-4 *:mt-1">
                          <Slider
                            name="confidence_threshold"
                            defaultValue={[0.3]}
                            max={0.95}
                            min={0.05}
                            step={0.05}
                          />
                          <p className="text-stone-400">1800</p>
                        </div>
                      </form>
                    </AccordionContent>
                  </AccordionItem>
                  <div>
                    <AccordionItem
                      value="next"
                      className="flex w-[300px] cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-border bg-accent px-6 py-2 text-base font-semibold text-foreground"
                    >
                      Back <ArrowLeft className="size-4" />
                    </AccordionItem>
                    <AccordionItem
                      value="next"
                      className="mt-4 flex w-[300px] cursor-pointer items-center justify-center gap-2 rounded-3xl bg-stone-600 px-6 py-2 text-base font-semibold text-background dark:bg-stone-300"
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
