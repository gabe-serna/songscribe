"use client";

import PianoRoll from "@/components/PianoRoll";
import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function AudioMidiVisualizer({
  name,
  audioBlob,
  midiFile,
}: {
  name: string;
  audioBlob: Blob;
  midiFile: Blob;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const durationRef = useRef<number | null>(null);
  const lastRun = useRef(Date.now());

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const title = name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    if (audioBlob) {
      const objectURL = URL.createObjectURL(audioBlob);
      setUrl(objectURL);
      wavesurfer?.load(objectURL);

      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [audioBlob]);

  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: url || "",
    waveColor: "#eab308", //yellow-500
    progressColor: "#ca8a04", //yellow-600
    height: 50,
    barWidth: 5,
    barRadius: 5,
    autoScroll: true,
    autoCenter: true,
    normalize: true,
  });

  wavesurfer?.on("timeupdate", () => {
    setProgress(getProgressPercent(wavesurfer));
  });

  wavesurfer?.on("finish", () => {
    //Rate Limit Event Firing
    if (Date.now() - lastRun.current < 1000) return;

    lastRun.current = Date.now();
    wavesurfer?.stop();
    setIsPlaying(false);
    setProgress(0);
  });

  // Initialize Progress
  useEffect(() => {
    if (!isReady) return;
    setProgress(getProgressPercent(wavesurfer));

    // Ensure Midi and Audio have same duration
    if (!wavesurfer) return;
    durationRef.current = wavesurfer.getDuration();
    setProgress(0.1);
  }, [isReady]);

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        wavesurfer?.play();
      }, 100);
    } else {
      wavesurfer?.pause();
    }
  }, [isPlaying]);

  return (
    <div className="flex h-full w-[1000px] flex-col justify-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="mt-4">
        {durationRef.current && (
          <PianoRoll
            midiFile={midiFile}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            progress={progress}
            duration={wavesurfer?.getDuration() as number}
          />
        )}
      </div>
      <div className="mb-8 rounded-2xl bg-accent p-4 shadow-lg">
        <div
          className={isPlaying ? "pointer-events-none" : "cursor-col-resize"}
          ref={containerRef}
        />
      </div>
    </div>
  );
}

function getProgressPercent(wavesurfer: WaveSurfer | null) {
  if (!wavesurfer) return 0;
  return (wavesurfer.getCurrentTime() / wavesurfer.getDuration()) * 100;
}
