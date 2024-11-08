import * as Tone from "tone";

export default function synthInit(
  audioControllerRef: React.MutableRefObject<Tone.PanVol>,
  name: string,
) {
  const polySynth = new Tone.PolySynth(Tone.Synth)
    .connect(audioControllerRef.current)
    .toDestination();

  const guitarSample = new Tone.Sampler({
    urls: {
      E2: "guitar-low-e-sample.mp3",
      A2: "guitar-a-sample.mp3",
      D3: "guitar-d-sample.mp3",
      G3: "guitar-g-sample.mp3",
      B3: "guitar-b-sample.mp3",
      E4: "guitar-high-e-sample.mp3",
    },
    baseUrl: "/audio/guitar-samples/",
  }).toDestination();

  const bassSample = new Tone.Sampler({
    urls: { Db3: "bass-sample.wav" },
    baseUrl: "/audio/",
  }).toDestination();

  const pianoSample = new Tone.Sampler({
    urls: {
      C2: "piano_C2.mp3",
      E2: "piano_E2.mp3",
      Eb3: "piano_Eb3.mp3",
      Gb3: "piano_F#3.mp3",
      Ab4: "piano_Ab4.mp3",
      D4: "piano_D4.mp3",
      B4: "piano_B4.mp3",
      Ab5: "piano_Ab5.mp3",
      Db6: "piano_Db6.mp3",
      G6: "piano_G6.mp3",
    },
    baseUrl: "/audio/piano-samples/",
  }).toDestination();

  const kickSynth = new Tone.Player("/audio/kick-sample.mp3").toDestination();

  const tomSynth = new Tone.Player("/audio/tom-sample.mp3").toDestination();

  const snareSynth = new Tone.Player("/audio/snare-sample.mp3").toDestination();

  const hihatSynth = new Tone.Player("/audio/hihat-sample.mp3").toDestination();

  const crashSynth = new Tone.Player("/audio/crash-sample.wav").toDestination();

  let defaultSynth: Tone.PolySynth | Tone.Sampler;
  switch (name) {
    case "Guitar":
    case "Other":
    case "No Vocals":
      defaultSynth = guitarSample;
      break;
    case "Bass":
      defaultSynth = bassSample;
      break;
    case "Piano":
      defaultSynth = pianoSample;
      break;
    case "Vocals":
    default:
      defaultSynth = polySynth;
  }

  return {
    defaultSynth,
    kickSynth,
    tomSynth,
    snareSynth,
    hihatSynth,
    crashSynth,
  };
}
