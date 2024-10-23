"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";

interface PianoRollProps {
  midiFile: Blob; // Accepting the MIDI file as a Blob prop
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  progress: number;
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
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [midiData, setMidiData] = useState<MidiNote[]>([]);
  let tempo: number | null = null;

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
        tempo = midi.header.tempos[0].bpm;
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
    const noteHeight = 10; // Height of each note block
    const totalDuration = Math.max(
      ...notes.map((note) => note.time + note.duration),
    );
    const secondsPerBeat = 60 / tempo! || 120;
    const eightMeasures = 8 * 4 * secondsPerBeat;
    const timeScale = 1000 / eightMeasures; // Pixels Per Second
    canvas.width = totalDuration * timeScale;

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
    const synth = new Tone.Synth().toDestination();
    const transport = Tone.getTransport();

    let previousTime = -1;
    midiData.forEach((note) => {
      let time = note.time;

      if (time <= previousTime) {
        time = previousTime + 0.001;
      }
      transport.schedule((t) => {
        synth.triggerAttackRelease(note.note, note.duration, t);
      }, time);

      previousTime = time; // Update the previous time
    });

    transport.start();
    setIsPlaying(true);
  };

  // Stop playback
  const stopMidi = () => {
    const transport = Tone.getTransport();
    transport.stop();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (containerRef.current) {
      setScrollPercentage(containerRef.current, progress);
    }
  }, [progress]);

  // Draw the progress line on the piano roll
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   const width = canvas.width;
  //   const height = canvas.height;
  //   const totalDuration = Math.max(
  //     ...midiData.map((note) => note.time + note.duration),
  //   );
  //   const timeScale = width / totalDuration;

  //   // Redraw the progress line
  //   ctx.clearRect(0, 0, width, height);
  //   drawPianoRoll(midiData); // Redraw the piano roll notes

  //   // Draw progress line
  //   ctx.strokeStyle = "#d97706"; // Progress line color - yellow-600
  //   ctx.lineWidth = 2;
  //   ctx.beginPath();
  //   ctx.moveTo(progress * timeScale, 0);
  //   ctx.lineTo(progress * timeScale, height);
  //   ctx.stroke();
  // }, [progress, midiData]);

  return (
    <div>
      <div
        ref={containerRef}
        className="h-[420px] w-[1000px] overflow-x-scroll"
      >
        <canvas ref={canvasRef} width={1000} height={400} />
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

function getScrollPercentage(element: HTMLDivElement) {
  const scrollLeft = element.scrollLeft;
  const scrollWidth = element.scrollWidth;
  const clientWidth = element.clientWidth;

  const scrollPercentage = (scrollLeft / (scrollWidth - clientWidth)) * 100;

  return scrollPercentage;
}

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
