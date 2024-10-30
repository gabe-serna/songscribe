"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Waveform from "@/components/Waveform";
import MergeMidiButton from "@/components/MergeMidiButton";
import { AudioStorage, Stem } from "@/utils/types";
import { AudioContext } from "./AudioProvider";
import AudioForm from "./AudioForm";
import handleMidiConversion from "@/utils/getMidi";

export default function Page() {
  const { audioStorage, setAudioStorage, tempo, songName } =
    useContext(AudioContext);
  const [flatScore, setFlatScore] = useState<string | null>(null);
  const [isMidiComplete, setIsMidiComplete] = useState(false);
  const flatRef = useRef<HTMLDivElement>(null);
  // const lastRun = useRef(Date.now());

  // Convert to Midi
  useEffect(() => {
    // Temporarily throttle the conversion to once per second
    // if (Date.now() - lastRun.current < 1000) return;
    // lastRun.current = Date.now();

    handleMidiConversion(audioStorage, setAudioStorage, tempo).then(
      (isComplete) => {
        if (isComplete) {
          setIsMidiComplete(true);
        }
      },
    );
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

  return (
    <div className="flex w-full flex-col justify-around">
      {!audioStorage && <AudioForm />}
      {audioStorage &&
        Object.entries(audioStorage as Record<keyof AudioStorage, Stem>).map(
          ([key, stem]) => {
            if (!stem.midiBlob) return;
            return (
              <Waveform
                key={key}
                name={stem.name}
                audioBlob={stem.audioBlob}
                midiFile={stem.midiBlob}
              />
            );
          },
        )}
      {isMidiComplete && (
        <MergeMidiButton
          tempo={tempo.current}
          audioStorage={audioStorage}
          songName={songName.current}
          setFlatScore={setFlatScore}
        />
      )}
      {flatScore && <div ref={flatRef} className="h-[75vh] w-full" />}
    </div>
  );
}
