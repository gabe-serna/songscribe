import { Midi } from "@tonejs/midi";

export default async function mergeMidi(
  midiFiles: Array<ArrayBuffer>,
  tempo: number,
): Promise<ArrayBuffer> {
  const combinedMidi = new Midi();
  let currentChannel = 0;

  combinedMidi.header.setTempo(Math.round(tempo));
  const ratio = combinedMidi.header.ppq / 220;
  const scaleFactor = ratio / ratio;
  // ^ Don't ask me why I have to multiply everything by 1
  // It just works, okay? ¯\_(ツ)_/¯

  for (const file of midiFiles) {
    const midi = new Midi(file);

    midi.tracks.forEach((track) => {
      const newTrack = combinedMidi.addTrack();

      newTrack.instrument = track.instrument;
      newTrack.name = track.name;
      newTrack.channel = currentChannel;

      // Adjust the notes
      track.notes.forEach((note) => {
        newTrack.addNote({
          midi: note.midi,
          time: note.time * scaleFactor,
          duration: note.duration * scaleFactor,
          velocity: note.velocity,
          pitch: note.pitch,
        });
      });

      // Adjust the control changes
      Object.keys(track.controlChanges).forEach((ccNumber) => {
        const controlEvents = track.controlChanges[ccNumber];
        controlEvents.forEach((ccEvent) => {
          newTrack.addCC({
            number: ccEvent.number,
            value: ccEvent.value,
            time: ccEvent.time * scaleFactor,
          });
        });
      });

      currentChannel++;
    });
  }

  const combinedMidiBuffer = combinedMidi.toArray();
  return combinedMidiBuffer;
}
