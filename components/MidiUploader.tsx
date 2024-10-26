"use client";
import { ChangeEvent, useState } from "react";
import { Header, Midi } from "@tonejs/midi";
import { ControlChanges } from "@tonejs/midi/dist/ControlChanges";

interface Note {
  name: string;
  time: number;
  duration: number;
  velocity: number;
}

interface Track {
  header: Header;
  trackNumber: number;
  instrument: string;
  name: string;
  notes: Note[];
  controlChanges: ControlChanges; // Adjust the type as needed
}

export default function MidiUploader() {
  const [metadata, setMetadata] = useState<Track | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);

      // Extract metadata in JSON format
      const header = midi.header;
      const parsedMetadata = midi.tracks.map((track, index) => ({
        header: header,
        trackNumber: index + 1,
        instrument: track.instrument.name,
        name: track.name,
        notes: track.notes.map((note) => ({
          name: note.name,
          time: note.time,
          duration: note.duration,
          velocity: note.velocity,
        })),
        controlChanges: track.controlChanges,
      }));

      setMetadata(parsedMetadata[0]);
    }
  };

  return (
    <div>
      <h2>Upload a MIDI File to View Metadata</h2>
      <input type="file" onChange={handleFileChange} accept=".mid,.midi" />

      {metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>}
    </div>
  );
}
