"use client";

import PianoRoll from "@/components/PianoRoll";
import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Skeleton } from "./ui/skeleton";

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
  pageUpdate: boolean;
  isDemo?: boolean;
  hideTitle?: boolean;
}

export default function AudioMidiVisualizer({
  name,
  audioBlob,
  midiFile,
  controls,
  pageUpdate,
  isDemo = false,
  hideTitle = false,
}: Props) {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastRun = useRef(Date.now());
  const { volume: midiVol, pan: midiPan } = controls[0];
  const { volume: audioVol, pan: audioPan } = controls[1];

  const audioCtxRef = useRef<AudioContext | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const title = name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  // Initialize Wavesurfer
  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: url || "",
    waveColor: "#eab308", // yellow-500
    progressColor: "#ca8a04", // yellow-600
    height: 50,
    barWidth: 5,
    barRadius: 5,
    autoScroll: true,
    autoCenter: true,
    normalize: true,
  });

  // Load audio when audioBlob changes
  useEffect(() => {
    if (audioBlob) {
      const objectURL = URL.createObjectURL(audioBlob);
      setUrl(objectURL);

      // Cleanup function
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [audioBlob]);

  // Assign Wavesurfer instance and attach event listeners
  useEffect(() => {
    if (wavesurfer && isReady) {
      // console.log("Setting up Wavesurfer instance for", title);
      wavesurferRef.current = wavesurfer;
      const dur = wavesurfer.getDuration();
      setDuration(dur);
      setProgress(0);

      // Event Handlers
      const handleTimeUpdate = () => {
        setProgress(getProgressPercent(wavesurfer));
      };

      const handleFinish = () => {
        if (Date.now() - lastRun.current < 1000) return;
        lastRun.current = Date.now();
        setIsPlaying(false);
        setProgress(0);
      };

      const handleDestroy = () => {
        if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
          // console.log("Closing Audio Context");
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
        // console.log("Destroying Wavesurfer instance for", title);
        wavesurferRef.current = null;
      };

      // Attach event listeners
      wavesurfer.on("timeupdate", handleTimeUpdate);
      wavesurfer.on("finish", handleFinish);
      wavesurfer.on("destroy", handleDestroy);

      // Cleanup function
      return () => {
        wavesurfer.un("timeupdate", handleTimeUpdate);
        wavesurfer.un("finish", handleFinish);
        wavesurfer.un("destroy", handleDestroy);
        wavesurferRef.current = null;
      };
    }
  }, [wavesurfer, isReady, duration]);

  // Set up the Web Audio API and connect pan node
  useEffect(() => {
    if (!wavesurferRef.current || !isReady) return;

    // Get the media element from wavesurfer
    const audioElement = wavesurferRef.current.getMediaElement();
    if (!audioElement) {
      console.error("No media element available");
      return;
    }

    // Create AudioContext if not already created
    if (!audioCtxRef.current) {
      const audioCtx = new window.AudioContext();
      audioCtxRef.current = audioCtx;

      const sourceNode = audioCtx.createMediaElementSource(audioElement);

      const panNode = audioCtx.createStereoPanner();
      panNode.pan.value = audioPan / 100;
      panNodeRef.current = panNode;

      sourceNode.connect(panNode);
      panNode.connect(audioCtx.destination);
    }

    // Update pan value
    if (panNodeRef.current) {
      panNodeRef.current.pan.value = audioPan / 100;
    }

    // Update volume
    wavesurferRef.current.setVolume(audioVol / 100);

    // Resume AudioContext on user interaction
    const resumeAudioContext = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };

    document.addEventListener("click", resumeAudioContext);

    // Cleanup function
    return () => {
      document.removeEventListener("click", resumeAudioContext);
    };
  }, [isReady, audioPan, audioVol]);

  // Update pan when audioPan changes
  useEffect(() => {
    if (panNodeRef.current) {
      panNodeRef.current.pan.value = audioPan / 100;
    }
  }, [audioPan]);

  // Update volume when audioVol changes
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(audioVol / 100);
    }
  }, [audioVol]);

  // Handle Play and Pause
  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        wavesurferRef.current?.play();
      }, 100);
    } else {
      wavesurferRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <div
      ref={parentRef}
      className="flex h-full w-full max-w-[800px] flex-col justify-center"
    >
      {!hideTitle && <h1 className="text-2xl font-bold">{title}</h1>}
      <div className="mt-4">
        {duration !== null && midiFile ? (
          <PianoRoll
            title={title}
            midiFile={midiFile}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            pageUpdate={pageUpdate}
            progress={progress}
            duration={duration}
            volume={midiVol}
            pan={midiPan}
            isDemo={isDemo}
          />
        ) : (
          <Skeleton className="mb-9 flex h-[300px] items-center justify-center rounded-2xl bg-accent text-card-foreground shadow-lg dark:shadow-stone-950 xl:h-[400px]">
            Generating Midi...
          </Skeleton>
        )}
      </div>
      <div className="mb-8 w-full rounded-2xl bg-accent p-4 shadow-lg">
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
