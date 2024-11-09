"use client";

import PianoRoll from "@/components/PianoRoll";
import WaveSurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";

export default function Preview() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const durationRef = useRef<number | null>(null);
  const ref = useRef<HTMLInputElement | null>(null);
  const lastRun = useRef(Date.now());

  // Refs for Web Audio API nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Ref to store the WaveSurfer instance
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [midiFile, setMidiFile] = useState<File | null>(null);

  const midiPan = -100;
  const midiVol = 50;
  const audioPan = 100;
  const audioVol = 50;

  // Function to initialize WaveSurfer and Web Audio API
  const initializeWaveSurfer = () => {
    if (wavesurferRef.current) return; // Prevent multiple initializations

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current as HTMLElement,
      waveColor: "#44403c", // stone-700
      progressColor: "#292524", // stone-800
      height: 100,
      barWidth: 5,
      barHeight: 4,
      barRadius: 5,
      autoScroll: true,
      autoCenter: true,
      backend: "MediaElement",
      normalize: true,
      url: "/audio/rude_alpha_guitar.wav",
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on("ready", () => {
      durationRef.current = wavesurfer.getDuration();
      setProgress(0.1);
    });

    wavesurfer.on("timeupdate", () => {
      const prog = getProgressPercent(progressRef);
      setProgress(prog);
    });

    wavesurfer.on("finish", () => {
      // Rate Limit Event Firing
      if (Date.now() - lastRun.current < 1000) return;

      lastRun.current = Date.now();
      wavesurfer.stop();
      setIsPlaying(false);
      setProgress(0);
    });

    // Set up the Web Audio API and connect pan node
    const audioElement = wavesurfer.getMediaElement();
    if (audioElement) {
      // Create AudioContext
      const audioCtx = new window.AudioContext();
      audioCtxRef.current = audioCtx;

      // Create MediaElementAudioSourceNode
      const sourceNode = audioCtx.createMediaElementSource(audioElement);
      sourceNodeRef.current = sourceNode;

      // Create StereoPannerNode
      const panNode = audioCtx.createStereoPanner();
      panNode.pan.value = audioPan / 100; // Normalize pan value (-1 to 1)
      panNodeRef.current = panNode;

      // Connect the nodes: source -> pan -> destination
      sourceNode.connect(panNode);
      panNode.connect(audioCtx.destination);
    }

    // Resume AudioContext on user interaction
    const resumeAudioContext = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };

    document.addEventListener("click", resumeAudioContext, { once: true });
  };

  // Function to handle play/pause button click
  const handlePlayPause = () => {
    if (!wavesurferRef.current) {
      initializeWaveSurfer();
    }

    if (isPlaying) {
      wavesurferRef.current?.pause();
      setIsPlaying(false);
    } else {
      wavesurferRef.current?.play();
      setIsPlaying(true);
    }
  };

  // Update pan when audioPan changes
  useEffect(() => {
    if (panNodeRef.current) {
      panNodeRef.current.pan.value = audioPan / 100; // Normalize pan value (-1 to 1)
    }
  }, [audioPan]);

  // Update volume when audioVol changes
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(audioVol / 100);
    }
  }, [audioVol]);

  // Store Progress Bar Element
  useEffect(() => {
    if (!wavesurferRef.current) return;
    const child = containerRef.current?.childNodes[0] as HTMLDivElement;
    const shadowRoot = child.shadowRoot;
    if (!shadowRoot) return;
    progressRef.current = shadowRoot.querySelector(".progress");
    setProgress(getProgressPercent(progressRef) as number);
  }, [wavesurferRef.current]);

  // For testing purposes, load a MIDI file on page load
  useEffect(() => {
    async function loadTempFile() {
      const res = await fetch("/audio/rude_alpha_guitar.mid");
      const blob = await res.blob();
      const file = new File([blob], "rude_alpha_guitar.mid", {
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
        <button
          onClick={handlePlayPause}
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <input
          ref={ref}
          type="file"
          accept=".mid"
          onChange={(e) => {
            if (!e.target.files) return;
            setMidiFile(e.target.files[0]);
          }}
        />
        {midiFile && progressRef.current && (
          <PianoRoll
            title="MIDI Preview"
            midiFile={midiFile}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            progress={progress}
            duration={wavesurferRef.current?.getDuration() || 0}
            pan={midiPan}
            volume={midiVol}
          />
        )}
      </div>
      <div
        className={isPlaying ? "pointer-events-none" : "cursor-col-resize"}
        ref={containerRef}
      />
    </div>
  );
}

function getProgressPercent(
  progressRef: React.MutableRefObject<HTMLDivElement | null>,
) {
  if (progressRef.current) {
    const width = window.getComputedStyle(progressRef.current).width;
    const progress =
      (parseInt(width) / progressRef.current.parentElement!.clientWidth) * 100;
    return progress;
  }
  return 0;
}
