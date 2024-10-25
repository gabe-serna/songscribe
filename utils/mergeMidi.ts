import { Midi } from "@tonejs/midi";

export default async function mergeMidi(midiFiles: Array<ArrayBuffer>) {
  const combinedMidi = new Midi();
  let currentChannel = 0;

  for (const file of midiFiles) {
    const midi = new Midi(file);

    midi.tracks.forEach((track) => {
      const newTrack = combinedMidi.addTrack();

      newTrack.instrument = track.instrument;
      newTrack.name = track.name;
      newTrack.channel = currentChannel;
      newTrack.notes = [...track.notes];
      newTrack.controlChanges = { ...track.controlChanges };

      currentChannel++;
    });
  }

  const combinedMidiBuffer = combinedMidi.toArray();
  return combinedMidiBuffer;
}
