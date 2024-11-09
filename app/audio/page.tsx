"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { AudioContext } from "./AudioProvider";
import AudioForm from "./AudioForm";
import handleMidiConversion from "@/utils/getMidi";
import MidiEditor from "./MidiEditor";

export default function Page() {
  const { audioForm, audioStorage, setAudioStorage, songName } =
    useContext(AudioContext);
  const [flatScore, setFlatScore] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isMidiComplete, setIsMidiComplete] = useState(false);
  const flatRef = useRef<HTMLDivElement>(null);

  // Convert to Midi
  useEffect(() => {
    if (isConverting) return;
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
    <div
      className="flex w-full max-w-[1200px] flex-col items-center justify-around max-xl:px-20"
      id="resize container"
    >
      {!audioStorage && <AudioForm />}
      {audioStorage && <MidiEditor conversionFlag={setIsConverting} />}
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
