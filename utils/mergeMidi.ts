import { Midi } from "@tonejs/midi";

export default async function mergeMidi(midiFiles: Array<ArrayBuffer>) {
  const combinedMidi = new Midi();

  for (const file of midiFiles) {
    const midi = new Midi(file);

    midi.tracks.forEach((track) => {
      const newTrack = combinedMidi.addTrack();

      newTrack.instrument = track.instrument;
      newTrack.name = track.name;
      newTrack.channel = track.channel;
      newTrack.notes = [...track.notes];
      newTrack.controlChanges = { ...track.controlChanges };
    });
  }

  const combinedMidiBuffer = combinedMidi.toArray();
  return combinedMidiBuffer;
}
