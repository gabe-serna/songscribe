"use client";

import PianoRoll from "@/components/PianoRoll";
import WavesurferPlayer from "@wavesurfer/react";
import { useCallback, useState } from "react";
import WaveSurfer from "wavesurfer.js";
// import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";

export default function Preview() {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [midiFile, setMidiFile] = useState<File | null>(null);

  const onReady = useCallback((wavesurfer: WaveSurfer) => {
    setWavesurfer(wavesurfer);
    setIsPlaying(false);
  }, []);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <div className="flex h-full w-[1000px] flex-col justify-center">
      <WavesurferPlayer
        url="/audio/tsubasa_bass.mp3"
        waveColor="#eab308"
        progressColor="#a16207"
        height={200}
        barWidth={5}
        barHeight={4}
        barRadius={5}
        autoScroll={true}
        autoCenter={true}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</button>
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
