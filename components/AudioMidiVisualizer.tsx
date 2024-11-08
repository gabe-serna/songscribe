"use client";

import PianoRoll from "@/components/PianoRoll";
import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface Controls {
  volume: number;
  setVolume: (volume: number) => void;
  pan: number;
  setPan: (pan: number) => void;
}

interface Props {
  name: string;
  audioBlob: Blob;
  midiFile: Blob;
  controls: Controls[];
}

export default function AudioMidiVisualizer({
  name,
  audioBlob,
  midiFile,
  controls,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const durationRef = useRef<number | null>(null);
  const lastRun = useRef(Date.now());
  const { volume: midiVol, pan: midiPan } = controls[0];
  const { volume: audioVol, pan: audioPan } = controls[1];

  const audioCtxRef = useRef<AudioContext | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

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

  // Set up the Web Audio API and connect pan node
  useEffect(() => {
    if (!wavesurfer || !isReady) return;

    // Initialize Progress
    setProgress(getProgressPercent(wavesurfer));
    durationRef.current = wavesurfer.getDuration();
    setProgress(0.1);

    // Get the media element from wavesurfer
    const audioElement = wavesurfer.getMediaElement();
    if (!audioElement) {
      console.error("No media element available");
      return;
    }

    // Create AudioContext if not already created
    if (!audioCtxRef.current) {
      const audioCtx = new window.AudioContext();
      audioCtxRef.current = audioCtx;

      const sourceNode = audioCtx.createMediaElementSource(audioElement);
      sourceNodeRef.current = sourceNode;

      const panNode = audioCtx.createStereoPanner();
      panNode.pan.value = audioPan / 100;
      panNodeRef.current = panNode;

      sourceNode.connect(panNode);
      panNode.connect(audioCtx.destination);
    }

    // Resume AudioContext on user interaction
    const resumeAudioContext = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };

    document.addEventListener("click", resumeAudioContext);

    return () => {
      document.removeEventListener("click", resumeAudioContext);
    };
  }, [wavesurfer, isReady, audioPan]);

  // Update pan when audioPan changes
  useEffect(() => {
    if (panNodeRef.current) {
      panNodeRef.current.pan.value = audioPan / 100;
    }
  }, [audioPan]);

  // Update volume when audioVol changes
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setVolume(audioVol / 100);
    }
  }, [audioVol, wavesurfer]);

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
            volume={midiVol}
            pan={midiPan}
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
