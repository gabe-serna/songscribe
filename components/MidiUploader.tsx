"use client";
import { ChangeEvent, useState } from "react";
import { Header, Midi } from "tonejs-midi-fix";
// import { ControlChanges } from "tonejs-midi-fix/dist/ControlChanges";

// interface Note {
//   name: string;
//   time: number;
//   duration: number;
//   velocity: number;
// }

interface Track {
  header: Header;
  trackNumber: number;
  instrument: string;
  channel: number;
  name: string;
  // notes: Note[];
  // controlChanges: ControlChanges;
}

export default function MidiUploader() {
  const [metadata, setMetadata] = useState<Track[] | null>(null);

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
        channel: track.channel,
        name: track.name,
        // notes: track.notes.map((note) => ({
        //   name: note.name,
        //   time: note.time,
        //   duration: note.duration,
        //   velocity: note.velocity,
        // })),
        // controlChanges: track.controlChanges,
      }));

      setMetadata(parsedMetadata);
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
