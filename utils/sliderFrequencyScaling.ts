export default function sliderFrequencyScaling(): number[] {
  const frequencies: number[] = [0];
  const targetNotes = [
    { note: "C", index: 0 },
    { note: "E", index: 4 },
    { note: "G", index: 7 },
  ];

  // MIDI number for C1 is 24 and for C8 is 108
  for (let midiNumber = 24; midiNumber <= 108; midiNumber++) {
    const noteIndex = midiNumber % 12;
    const note = targetNotes.find((n) => n.index === noteIndex);
    if (note) {
      const frequency = 440 * Math.pow(2, (midiNumber - 69) / 12);
      frequencies.push(parseFloat(frequency.toFixed(2)));
    }
  }

  frequencies.push(13000);
  return frequencies;
}
