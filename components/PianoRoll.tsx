"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";

interface PianoRollProps {
  midiFile: Blob; // Accepting the MIDI file as a Blob prop
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  progress: number;
  duration: number;
}

interface MidiNote {
  time: number;
  note: string;
  duration: number;
}

const PianoRoll: React.FC<PianoRollProps> = ({
  midiFile,
  isPlaying,
  setIsPlaying,
  progress,
  duration,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [midiData, setMidiData] = useState<MidiNote[]>([]);

  const tempo = useRef(120);

  useEffect(() => {
    // Parse the MIDI file and extract note data from the Blob
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        const midi = await Midi.fromUrl(URL.createObjectURL(midiFile));
        // const midi = await Midi.fromUrl("/audio/tsubasa_bass.mid");

        // Extract note data
        const notes: MidiNote[] = [];
        tempo.current = midi.header.tempos[0].bpm;
        midi.tracks.forEach((track) => {
          track.notes.forEach((note) => {
            notes.push({
              time: note.time,
              note: note.name,
              duration: note.duration,
            });
          });
        });

        setMidiData(notes); // Save parsed MIDI notes to state
        drawPianoRoll(notes); // Render the piano roll
      }
    };

    reader.readAsArrayBuffer(midiFile); // Read the MIDI Blob as an ArrayBuffer
  }, [midiFile]);

  // Function to render the piano roll
  const drawPianoRoll = (notes: MidiNote[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const height = canvas.height;
    const noteHeight = 5; // Height of each note block
    const secondsPerBeat = 60 / tempo.current;
    const eightMeasures = 8 * 4 * secondsPerBeat;
    const timeScale = 1000 / eightMeasures; // Pixels Per Second
    console.log(duration * timeScale + 1000);
    canvas.width = duration * timeScale + 1000;

    ctx.clearRect(0, 0, 1000, height);

    // Draw each note as a rectangle
    notes.forEach((note) => {
      const x = note.time * timeScale;
      const y = (Tone.Frequency(note.note).toMidi() - 21) * noteHeight;
      const noteWidth = note.duration * timeScale;

      ctx.fillStyle = "#eab308"; // Note color - yellow-500
      ctx.fillRect(x, height - y - noteHeight, noteWidth, noteHeight); // Draw the note rectangle
    });
  };

  // Play the MIDI file using Tone.js
  const playMidi = () => {
    const synth = new Tone.PolySynth(Tone.AMSynth).toDestination();
    const transport = Tone.getTransport();
    const startTime = getScrollTime(progress, duration);

    midiData.forEach((note) => {
      let time = note.time - 0.1 - startTime;
      transport.schedule((t) => {
        synth.triggerAttackRelease(note.note, note.duration, t);
      }, time);
    });

    transport.start();
    setIsPlaying(true);
  };

  // Stop playback
  const stopMidi = () => {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    setIsPlaying(false);
  };

  useEffect(() => {
    // Clear Transport if playback is stopped when audio finishes
    if (!isPlaying) {
      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (containerRef.current) {
      setScrollPercentage(containerRef.current, progress);
    }
  }, [progress]);

  return (
    <div>
      <div className="relative flex h-[420px]">
        <div
          ref={containerRef}
          className="no-scrollbar h-full w-[1000px] overflow-x-scroll"
        >
          <canvas ref={canvasRef} width={1000} height={400} />
        </div>

        {/* <div className="absolute h-full w-16 bg-white" /> */}
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={isPlaying ? stopMidi : playMidi}>
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default PianoRoll;

function setScrollPercentage(
  element: HTMLDivElement,
  percentage: number,
): void {
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  const scrollableWidth = element.scrollWidth - element.clientWidth;
  const targetScrollLeft = (percentage / 100) * scrollableWidth;

  element.scrollLeft = targetScrollLeft;
}

function getScrollTime(
  scrollPercentage: number,
  totalDuration: number,
): number {
  const currentTimeInSeconds = (scrollPercentage / 100) * totalDuration;
  return currentTimeInSeconds;
}
