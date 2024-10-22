"use client";
import WaveSurfer from "wavesurfer.js";
import * as Tone from "tone";
import { parseMidi } from "midi-file";
import { useEffect, useRef, useState } from "react";

interface AudioMidiVisualizerProps {
  audioSrc: string;
  midiBlob: Blob;
}

type MidiNote = {
  time: number;
  note: string;
  duration: number;
};

export default function MidiVisualizer({
  audioSrc,
  midiBlob,
}: AudioMidiVisualizerProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [midiData, setMidiData] = useState<any[]>([]); // State to hold parsed MIDI notes

  useEffect(() => {
    // Initialize WaveSurfer for audio waveform visualization
    if (waveformRef.current) {
      const wavesurferInstance = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        cursorColor: "navy",
      });

      // Load audio file
      wavesurferInstance.load(audioSrc);
      setWaveSurfer(wavesurferInstance);
    }

    // Cleanup on unmount
    return () => {
      if (waveSurfer) {
        waveSurfer.destroy();
      }
    };
  }, [audioSrc, waveSurfer]);

  // Parse MIDI file and extract note data
  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      if (arrayBuffer) {
        const midiArray = new Uint8Array(arrayBuffer as ArrayBuffer);
        const parsedMidi = parseMidi(midiArray); // Parse the MIDI file

        const notes: MidiNote[] = [];

        // Iterate through tracks and store note information
        parsedMidi.tracks.forEach((track) => {
          let currentTime = 0;

          track.forEach((event) => {
            currentTime += event.deltaTime;

            if (event.type === "noteOn" && event.velocity > 0) {
              notes.push({
                time: currentTime / 1000, // convert deltaTime to seconds
                note: Tone.Frequency(event.noteNumber, "midi").toNote(),
                duration: event.deltaTime * 0.001, // Example duration calculation
              });
            }
          });
        });

        setMidiData(notes);
      }
    };

    if (midiBlob) {
      reader.readAsArrayBuffer(midiBlob); // Read the MIDI Buffer as ArrayBuffer
    }
  }, [midiBlob]);

  const playMidi = () => {
    if (!midiData.length) {
      console.error("No MIDI data available to play");
      return;
    }

    const synth = new Tone.Synth().toDestination();
    const transport = Tone.getTransport();

    // Schedule MIDI notes based on parsed MIDI file
    midiData.forEach((note) => {
      transport.schedule((time) => {
        synth.triggerAttackRelease(note.note, note.duration, time);
      }, note.time);
    });

    transport.start();
  };

  return (
    <div>
      {/* WaveSurfer.js visualization */}
      <div ref={waveformRef} className="h-20 w-1/2"></div>

      {/* Buttons for control */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => waveSurfer?.playPause()}>
          Play/Pause Audio
        </button>
        <button onClick={playMidi}>Play MIDI</button>
      </div>
    </div>
  );
}
