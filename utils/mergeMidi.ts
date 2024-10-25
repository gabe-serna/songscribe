import { Midi } from "@tonejs/midi";

export default async function mergeMidi(
  midiFiles: Array<ArrayBuffer>,
  tempo: number,
): Promise<ArrayBuffer> {
  const combinedMidi = new Midi();
  let currentChannel = 0;

  // combinedMidi.header.keySignatures = [];
  // const bps = Math.round(60000000 / tempo);
  combinedMidi.header.setTempo(tempo);

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
