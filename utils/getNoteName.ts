export default function getNoteName(frequency: number): string {
  const A4 = 440;

  const midiNumber = Math.round(69 + 12 * Math.log2(frequency / A4));

  if (midiNumber < 0 || midiNumber > 127) return "none";

  const octave = Math.floor(midiNumber / 12) - 1;
  const noteIndex = midiNumber % 12;
  const noteName = noteNames[noteIndex];

  return `${noteName}${octave}`;
}

const noteNames = [
  "C",
  "C#",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];
