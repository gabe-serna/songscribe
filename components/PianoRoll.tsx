"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";

interface PianoRollProps {
  midiFile: Blob; // Accepting the MIDI file as a Blob prop
}

interface MidiNote {
  time: number;
  note: string;
  duration: number;
}

const PianoRoll: React.FC<PianoRollProps> = ({ midiFile }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [midiData, setMidiData] = useState<MidiNote[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Track progress of MIDI playback

  useEffect(() => {
    // Parse the MIDI file and extract note data from the Blob
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        const midi = await Midi.fromUrl(URL.createObjectURL(midiFile)); // Use Tone.Midi with ArrayBuffer

        // Extract note data
        const notes: MidiNote[] = [];
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

    const width = canvas.width;
    const height = canvas.height;
    const noteHeight = 10; // Height of each note block
    const totalDuration = Math.max(
      ...notes.map((note) => note.time + note.duration),
    );
    const timeScale = width / totalDuration; // Scale the time to fit canvas width

    ctx.clearRect(0, 0, width, height);

    // Draw each note as a rectangle
    notes.forEach((note) => {
      const x = note.time * timeScale;
      const y = (Tone.Frequency(note.note).toMidi() - 21) * noteHeight;
      const noteWidth = note.duration * timeScale;

      ctx.fillStyle = "#007bff"; // Note color
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

    // Update the progress line as the MIDI plays
    transport.scheduleRepeat(() => {
      setProgress(transport.seconds);
    }, 0.01);
  };

  // Stop playback
  const stopMidi = () => {
    const transport = Tone.getTransport();
    transport.stop();
    setIsPlaying(false);
    setProgress(0);
  };

  // Draw the progress line on the piano roll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const totalDuration = Math.max(
      ...midiData.map((note) => note.time + note.duration),
    );
    const timeScale = width / totalDuration;

    // Redraw the progress line
    ctx.clearRect(0, 0, width, height);
    drawPianoRoll(midiData); // Redraw the piano roll notes

    // Draw progress line
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progress * timeScale, 0);
    ctx.lineTo(progress * timeScale, height);
    ctx.stroke();
  }, [progress, midiData]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={400} />

      <div style={{ marginTop: "10px" }}>
        <button onClick={isPlaying ? stopMidi : playMidi}>
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default PianoRoll;
