"use client";

import PianoRoll from "@/components/PianoRoll";
import { useWavesurfer } from "@wavesurfer/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Preview() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLInputElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [midiFile, setMidiFile] = useState<File | null>(null);

  const { wavesurfer, isReady, currentTime } = useWavesurfer({
    container: containerRef,
    url: "/audio/tsubasa_bass.mp3",
    waveColor: "#eab308",
    progressColor: "#a16207",
    height: 200,
    barWidth: 5,
    barHeight: 4,
    barRadius: 5,
    autoScroll: true,
    autoCenter: true,
  });

  wavesurfer?.on("timeupdate", () => {
    // if i wanted to use progress as a measure of seconds i can use
    // these methods below
    // const time = wavesurfer.getCurrentTime() / wavesurfer.getDuration();

    setProgress(getProgressPercent(progressRef) as number);
  });

  // Store Progress Bar Element
  useEffect(() => {
    if (!isReady) return;
    const child = containerRef.current?.childNodes[0] as HTMLDivElement;
    const shadowRoot = child.shadowRoot;
    if (!shadowRoot) return;
    progressRef.current = shadowRoot.querySelector(".progress");
    setProgress(getProgressPercent(progressRef) as number);
  }, [isReady]);

  useEffect(() => {
    wavesurfer && wavesurfer.playPause();
  }, [isPlaying]);

  //For testing purposes, load a MIDI file on page load
  useEffect(() => {
    async function loadTempFile() {
      const res = await fetch("/audio/tsubasa_bass.mid");
      const blob = await res.blob();
      const file = new File([blob], "tsubasa_bass.mid", {
        type: "audio/midi",
      });

      if (ref.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        ref.current.files = dataTransfer.files;
        setMidiFile(dataTransfer.files[0]);
      }
    }

    loadTempFile();
  }, []);

  return (
    <div className="flex h-full w-[1000px] flex-col justify-center">
      <div>
        <input
          ref={ref}
          type="file"
          accept=".mid"
          onChange={(e) => {
            if (!e.target.files) return;
            setMidiFile(e.target.files[0]);
          }}
        />
        {midiFile && (
          <PianoRoll
            midiFile={midiFile}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            progress={progress}
          />
        )}
      </div>
      <div ref={containerRef} />
    </div>
  );
}

function getProgressPercent(
  progressRef: React.MutableRefObject<HTMLDivElement | null>,
) {
  if (progressRef.current) {
    const width = window.getComputedStyle(progressRef.current).width;
    const progress = parseInt(width) / 10;
    // console.log("progress: ", progress, "%");
    return progress;
  }
}
