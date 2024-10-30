"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Waveform from "@/components/Waveform";
import MergeMidiButton from "@/components/MergeMidiButton";
import { AudioStorage, Stem, Tracks } from "@/utils/types";
import { AudioContext } from "./AudioProvider";
import AudioForm from "./AudioForm";

const apiBaseUrl = "http://localhost:8000";

export default function Page() {
  const { audioStorage, setAudioStorage, tempo, songName } =
    useContext(AudioContext);
  const [flatScore, setFlatScore] = useState<string | null>(null);
  const [isMidiComplete, setIsMidiComplete] = useState(false);
  const flatRef = useRef<HTMLDivElement>(null);
  const lastRun = useRef(Date.now());

  // Convert to Midi
  useEffect(() => {
    async function convertToMidi(stem: Stem): Promise<Blob> {
      const formData = new FormData();
      formData.append("audio_file", stem.audioBlob);
      formData.append("tempo", `${tempo.current}`);
      if (stem.name === "drums") formData.append("percussion", "true");

      const response = await fetch(`${apiBaseUrl}/audio-to-midi`, {
        method: "POST",
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        console.error("Failed to convert audio");
        console.error(response.body);
      }
      const midiBlob = await response.blob();

      // **Optional: Download the MIDI file**
      // const url = URL.createObjectURL(midiBlob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = `${stem.name}.mid`;
      // a.click();
      // URL.revokeObjectURL(url);

      return midiBlob;
    }

    async function handleMidiConversion() {
      if (!audioStorage) return;
      const needsMidi: Stem[] = [];

      Object.keys(audioStorage as AudioStorage).forEach((value) => {
        const stem = audioStorage[value as Tracks];
        if (!stem.audioBlob) return;
        if (stem.midiBlob) return;
        needsMidi.push(stem);
      });

      if (needsMidi.length === 0) {
        setIsMidiComplete(true);
        return;
      }
      console.log("Converting to MIDI", needsMidi);

      const needMidiSingle = needsMidi.shift();

      const midiResults = await convertToMidi(needMidiSingle!).then(
        (midiBlob) => {
          return {
            name: needMidiSingle?.name,
            midiBlob,
            audioBlob: needMidiSingle?.audioBlob,
          };
        },
      );

      setAudioStorage((prev) => {
        if (!prev) return prev;
        const updatedStorage: AudioStorage = { ...prev };
        const name = needMidiSingle?.name as Tracks;
        updatedStorage[name] = {
          ...updatedStorage[name],
          midiBlob: midiResults.midiBlob,
        };

        return updatedStorage;
      });
    }

    if (!audioStorage) return;

    // Temporarily throttle the conversion to once per second
    if (Date.now() - lastRun.current < 1000) return;
    lastRun.current = Date.now();

    handleMidiConversion();
  }, [audioStorage]);

  // Get Flat Score
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
