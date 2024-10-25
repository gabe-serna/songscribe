import { analyze } from "web-audio-beat-detector";

export default async function getTempo(file: File): Promise<number> {
  const audioContext = new AudioContext();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  let tempo = await analyze(audioBuffer);
  tempo = Math.round(tempo);

  return tempo;
}
