import { Midi } from "tonejs-midi-fix";
import { KeySignatureEvent } from "tonejs-midi-fix/dist/Header";
import { Instrument } from "tonejs-midi-fix/dist/Instrument";

type Stem =
  | "vocals"
  | "no_vocals"
  | "drums"
  | "guitar"
  | "bass"
  | "piano"
  | "other";

const instrumentMap = {
  vocals: {
    number: 80,
    name: "lead 1 (square)",
    family: "synth lead",
    percussion: false,
  } as Instrument,
  no_vocals: {
    number: 1,
    name: "acoustic grand piano",
    family: "keyboard",
    percussion: false,
  } as Instrument,
  drums: {
    number: 0,
    name: "standard kit",
    family: "drums",
    percussion: true,
  } as Instrument,
  guitar: {
    number: 27,
    name: "electric guitar (clean)",
    family: "guitar",
    percussion: false,
  } as Instrument,
  bass: {
    number: 33,
    name: "electric bass (finger)",
    family: "bass",
    percussion: false,
  } as Instrument,
  piano: {
    number: 1,
    name: "bright acoustic piano",
    family: "keyboard",
    percussion: false,
  } as Instrument,
  other: {
    number: 20,
    name: "reed organ",
    family: "organ",
    percussion: false,
  } as Instrument,
};

export default async function mergeMidi(
  midiFiles: Array<ArrayBuffer>,
  tempo: number,
  names: string[],
  songName: string,
): Promise<{ combinedMidiBuffer: ArrayBuffer; key: string }> {
  const combinedMidi = new Midi();
  let currentChannel = 0;

  combinedMidi.header.timeSignatures = [
    { ticks: 0, timeSignature: [4, 4], measures: 0 },
  ];
  const mostCommonKeySignature = getMostCommonKeySignature(midiFiles);
  const key = `${mostCommonKeySignature.key} ${mostCommonKeySignature.scale}`;
  combinedMidi.header.keySignatures = [mostCommonKeySignature];
  combinedMidi.header.setTempo(Math.round(tempo));
  combinedMidi.header.name = songName;
  combinedMidi.header.update();

  const ratio = combinedMidi.header.ppq / 220;
  const scaleFactor = ratio / ratio;
  // ^ Don't ask me why I have to multiply everything by 1
  // It just works, okay? ¯\_(ツ)_/¯

  let i = 0;
  for (const file of midiFiles) {
    const midi = new Midi(file);

    for (const track of midi.tracks) {
      const newTrack = combinedMidi.addTrack();
      const name = names[i] as Stem;
      const instrument = instrumentMap[name];

      newTrack.name = name;
      newTrack.instrument = instrument;
      newTrack.channel = instrument.percussion ? 9 : currentChannel;

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

      newTrack.controlChanges = track.controlChanges;
    }
    currentChannel++;
    i++;
  }

  const combinedMidiBuffer = combinedMidi.toArray();
  return { combinedMidiBuffer, key };
}

function getMostCommonKeySignature(
  midiFiles: Array<ArrayBuffer>,
): KeySignatureEvent {
  const counts: {
    [key: string]: { count: number; keySignature: KeySignatureEvent };
  } = {};

  midiFiles.forEach((file) => {
    const midi = new Midi(file);
    midi.header.keySignatures.map((keySig) => {
      const key = `${keySig.key} ${keySig.scale}`;
      if (counts[key]) {
        counts[key].count += 1;
      } else {
        counts[key] = { count: 1, keySignature: keySig };
      }
    });
  });

  return Object.values(counts).reduce((a, b) => (a.count >= b.count ? a : b))
    .keySignature;
}
