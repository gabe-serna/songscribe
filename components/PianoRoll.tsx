"use client";

import React, { useEffect, useRef, useState } from "react";
import synthInit from "@/utils/synthInit";
import { Midi } from "tonejs-midi-fix";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { PauseCircle, PlayCircle } from "lucide-react";

interface PianoRollProps {
  title: string;
  midiFile: Blob;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  progress: number;
  duration: number;
  volume: number;
  pan: number;
}

interface MidiNote {
  time: number;
  note: string;
  duration: number;
}

const PianoRoll: React.FC<PianoRollProps> = ({
  title,
  midiFile,
  isPlaying,
  setIsPlaying,
  progress,
  duration,
  volume,
  pan,
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const pianoKeysCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const notesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pianoKeysContainerRef = useRef<HTMLDivElement | null>(null);
  const notesContainerRef = useRef<HTMLDivElement | null>(null);
  const activeNotesRef = useRef<Set<string>>(new Set());
  const audioControllerRef = useRef<Tone.PanVol | null>(null);

  const isPercussion = useRef(false);
  const [midiData, setMidiData] = useState<MidiNote[]>([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const vol = getVolume(volume);
  const panAmnt = pan / 100;

  const tempo = useRef(120);

  // Constants
  const pianoKeyWidth = 50;
  const containerWidth = parentRef.current?.clientWidth || 800 - pianoKeyWidth;
  const noteHeight = containerWidth > 600 ? 7 : containerWidth > 300 ? 6 : 5;
  const totalNotes = 88;
  const canvasHeight = totalNotes * noteHeight;

  // Helper function to compare two sets
  const areSetsEqual = (a: Set<string>, b: Set<string>): boolean => {
    if (a.size !== b.size) return false;
    for (let item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  };

  useEffect(() => {
    // Parse the MIDI file
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = await midiFile.arrayBuffer();
      const midi = new Midi(arrayBuffer);

      // Extract note data
      const notes: MidiNote[] = [];
      tempo.current = midi.header.tempos[0]?.bpm || 120;

      if (midi.tracks.length > 0) {
        isPercussion.current = midi.tracks[0].instrument.percussion;
      } else isPercussion.current = false;

      midi.tracks.forEach((track) => {
        track.notes.forEach((note) => {
          notes.push({
            time: note.time,
            note: note.name,
            duration: note.duration,
          });
        });
      });

      setMidiData(notes);
      drawPianoKeys(); // Draw piano keys once
      drawNotes(notes);
    };

    reader.readAsArrayBuffer(midiFile);
  }, [midiFile]);

  // Draw piano keys with active notes highlighted
  const drawPianoKeys = (activeNotes: Set<string> = activeNotesRef.current) => {
    const canvas = pianoKeysCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = pianoKeyWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < totalNotes; i++) {
      const midiNote = 21 + i;
      const isBlack = isBlackKey(midiNote);
      const y = i * noteHeight;
      const noteName = Tone.Frequency(midiNote, "midi").toNote();

      // Determine if the current key is active
      const isActive = activeNotes.has(noteName);

      // Set fill color based on active state
      if (isActive) {
        ctx.fillStyle = isBlack ? "#ca8a04" : "#fde047"; // Yellow colors for active keys
      } else {
        ctx.fillStyle = isBlack ? "black" : "white"; // Default colors for inactive keys
      }

      ctx.fillRect(0, canvasHeight - y - noteHeight, pianoKeyWidth, noteHeight);
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        0,
        canvasHeight - y - noteHeight,
        pianoKeyWidth,
        noteHeight,
      );

      // **Add the octave number to 'C' keys**
      if (midiNote % 12 === 0) {
        const octave = Math.floor(midiNote / 12) - 1;

        ctx.fillStyle = "black";
        ctx.font = "6px Arial";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        const textX = pianoKeyWidth - 8;
        const textY = canvasHeight - y - noteHeight / 2;

        ctx.fillText(octave.toString(), textX, textY);
      }
    }
  };

  // Determine if a MIDI note is a black key
  const isBlackKey = (midiNote: number): boolean => {
    const noteIndex = midiNote % 12;
    return [1, 3, 6, 8, 10].includes(noteIndex); // C#, D#, F#, G#, A#
  };

  const drawNotes = (notes: MidiNote[]) => {
    const canvas = notesCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const height = canvas.height;
    const secondsPerBeat = 60 / tempo.current;
    const measures = containerWidth > 600 ? 8 : containerWidth > 300 ? 6 : 4;
    const viewLength = measures * 4 * secondsPerBeat;
    const timeScale = containerWidth / viewLength; // Pixels Per Second
    canvas.width = duration * timeScale + containerWidth - pianoKeyWidth;

    ctx.clearRect(0, 0, containerWidth, height);

    // Draw each note as a rectangle
    notes.forEach((note) => {
      const x = note.time * timeScale;
      const y = (Tone.Frequency(note.note).toMidi() - 21) * noteHeight;
      const noteWidth = note.duration * timeScale;

      ctx.fillStyle = isDark ? "#a8a29e" : "#44403c";
      ctx.fillRect(x, height - y - noteHeight, noteWidth, noteHeight);
    });
  };

  // Play MIDI
  const playMidi = async () => {
    await Tone.start();
    if (!audioControllerRef.current) {
      audioControllerRef.current = new Tone.PanVol(
        panAmnt,
        vol,
      ).toDestination();
    }

    // Initialize individual synths
    const {
      defaultSynth,
      kickSynth,
      tomSynth,
      snareSynth,
      hihatSynth,
      crashSynth,
    } = synthInit(
      audioControllerRef as React.MutableRefObject<Tone.PanVol>,
      title,
    );

    const transport = Tone.getTransport();
    const startTime = getScrollTime(progress, duration);

    // Reset active notes
    activeNotesRef.current = new Set();

    // Schedule each note
    midiData.forEach((note) => {
      let synth: Tone.PolySynth | Tone.Player | Tone.Sampler;
      let time = note.time - startTime;

      if (isPercussion.current) {
        switch (note.note) {
          case "B3":
            synth = kickSynth;
            break;
          case "D2":
            synth = snareSynth;
            break;
          case "B2":
            synth = tomSynth;
            break;
          case "F#2":
            synth = hihatSynth;
            break;
          case "C#3":
            synth = crashSynth;
            break;
          default:
            synth = kickSynth;
        }
      } else {
        synth = defaultSynth;
      }

      const duration = Math.max(note.duration, 0.01);
      transport.schedule((t) => {
        switch (true) {
          case synth instanceof Tone.Player:
            if (!synth.loaded) synth.autostart = true;
            else synth.start(t);
            break;

          case synth instanceof Tone.Sampler:
            if (synth.loaded)
              synth.triggerAttackRelease(note.note, duration, t);
            break;

          default:
            synth.triggerAttackRelease(note.note, duration, t);
            break;
        }
      }, time);
    });

    transport.start();
    setIsPlaying(true);
  };

  // Stop Midi
  const stopMidi = () => {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    setIsPlaying(false);
    activeNotesRef.current = new Set();
    drawPianoKeys();
  };

  // Sync vertical scrolling
  const syncScroll = () => {
    if (pianoKeysContainerRef.current && notesContainerRef.current) {
      pianoKeysContainerRef.current.scrollTop =
        notesContainerRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (notesContainerRef.current) {
      setScrollPercentage(notesContainerRef.current, progress);
    }
  }, [progress]);

  // Update active notes based on progress
  useEffect(() => {
    // Determine the current time based on progress
    const currentTime = (progress / 100) * duration;
    const currentlyActiveNotes = new Set<string>();

    midiData.forEach((note) => {
      if (
        currentTime >= note.time &&
        currentTime <= note.time + note.duration
      ) {
        currentlyActiveNotes.add(note.note);
      }
    });

    // Update the activeNotesRef only if there is a change
    if (!areSetsEqual(activeNotesRef.current, currentlyActiveNotes)) {
      activeNotesRef.current = currentlyActiveNotes;
      drawPianoKeys(currentlyActiveNotes);
    }
  }, [progress, duration, midiData]);

  useEffect(() => {
    if (!audioControllerRef.current) return;
    audioControllerRef.current.volume.value = vol;
    audioControllerRef.current.pan.value = panAmnt;
  }, [vol, panAmnt]);

  return (
    <>
      <div
        ref={parentRef}
        className="relative flex h-[300px] rounded-2xl bg-accent shadow-lg dark:shadow-stone-900 xl:h-[400px]"
      >
        <div className="piano-roll-container relative flex w-full overflow-hidden rounded-2xl">
          {/* Piano Keys Container */}
          <div
            ref={pianoKeysContainerRef}
            className="piano-keys-container no-scrollbar overflow-y-hidden"
          >
            <canvas
              ref={pianoKeysCanvasRef}
              width={pianoKeyWidth}
              height={canvasHeight}
            />
          </div>

          {/* Notes Container */}
          <div
            ref={notesContainerRef}
            className="h-full w-full overflow-x-hidden overflow-y-scroll"
            onScroll={syncScroll}
          >
            <canvas
              ref={notesCanvasRef}
              width={containerWidth}
              height={canvasHeight}
            />
          </div>
        </div>
      </div>

      <div className="mt-[10px]">
        <Button
          onClick={isPlaying ? stopMidi : playMidi}
          className="button-primary h-auto translate-y-4 rounded-xl bg-accent px-6 py-1 leading-none shadow-md *:size-6 *:stroke-yellow-500 dark:shadow-stone-900 *:dark:stroke-yellow-700"
        >
          {isPlaying ? <PauseCircle /> : <PlayCircle />}
        </Button>
      </div>
    </>
  );
};

export default PianoRoll;

// Helper Functions
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

function getVolume(input: number): number {
  if (input < 0 || input > 100) {
    throw new Error("Input must be between 0 and 100");
  }

  const minOutput = -30;
  const maxOutput = 0;

  // Calculate the mapped value
  const mappedValue = (input / 100) * (maxOutput - minOutput) + minOutput;
  if (mappedValue == -30) return -Infinity;

  return mappedValue;
}
