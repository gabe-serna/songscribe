"use client";

import PianoRoll from "@/components/PianoRoll";
import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useRef, useState } from "react";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap";

export default function Preview() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
    minPxPerSec: 100,
    // plugins: [
    //   // Register the plugin
    //   MinimapPlugin.create({
    //     height: 20,
    //     waveColor: "#ddd",
    //     progressColor: "#999",
    //     // the Minimap takes all the same options as the WaveSurfer itself
    //   }),
    // ],
  });

  useEffect(() => {
    if (wavesurfer && isReady) {
      wavesurfer.registerPlugin(
        MinimapPlugin.create({
          height: 50,
          waveColor: "#666",
          progressColor: "#444",
          barWidth: 4,
          barHeight: 5,
          barRadius: 5,
        }),
      );
    }
  }, [isReady, wavesurfer]);

  useEffect(() => {
    wavesurfer && wavesurfer.playPause();
  }, [isPlaying]);

  return (
    <div className="flex h-full w-[1000px] flex-col justify-center">
      <div ref={containerRef} />

      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div>
        <input
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
          />
        )}
      </div>
    </div>
  );
}
