import { analyze } from "web-audio-beat-detector";

export default async function getTempo(file: File): Promise<number> {
  const audioContext = new AudioContext();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const monoAudio = convertToMono(audioContext, audioBuffer);
  let tempo: number;
  try {
    tempo = await analyze(monoAudio);
    tempo = Math.round(tempo);
  } catch {
    console.error(
      "Tempo unable to be detected! Defaulting to 120 bpm.\n\nAdd a tempo manually to fix the issue.",
    );
    tempo = 120;
  }

  return tempo;

  function convertToMono(
    audioContext: AudioContext,
    audioBuffer: AudioBuffer,
  ): AudioBuffer {
    const numberOfChannels = 1;
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;

    // Create a new AudioBuffer with one channel (mono)
    const monoBuffer = audioContext.createBuffer(
      numberOfChannels,
      length,
      sampleRate,
    );

    const monoData = monoBuffer.getChannelData(0);
    if (audioBuffer.numberOfChannels > 1) {
      const channels = [];
      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
      }

      for (let i = 0; i < length; i++) {
        let sum = 0;
        for (let j = 0; j < channels.length; j++) {
          sum += channels[j][i];
        }
        monoData[i] = sum / channels.length;
      }
    } else {
      // If the original buffer is already mono, copy the data directly
      const originalData = audioBuffer.getChannelData(0);
      monoData.set(originalData);
    }

    return monoBuffer;
  }
}
