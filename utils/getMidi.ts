import { MutableRefObject } from "react";
import { AudioStorage, Stem, Tracks } from "./types";

async function convertToMidi(
  stem: Stem,
  tempo: MutableRefObject<number>,
  download = false,
): Promise<Blob> {
  const formData = new FormData();
  formData.append("audio_file", stem.audioBlob);
  formData.append("tempo", `${tempo.current}`);
  if (stem.name === "drums") formData.append("percussion", "true");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/audio-to-midi`,
    {
      method: "POST",
      mode: "cors",
      body: formData,
    },
  );
  if (!response.ok) {
    console.error("Failed to convert audio");
    console.error(response.body);
  }
  const midiBlob = await response.blob();

  // **Optional: Download the MIDI file**
  if (download) {
    const url = URL.createObjectURL(midiBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stem.name}.mid`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return midiBlob;
}

export default async function handleMidiConversion(
  audioStorage: AudioStorage | null,
  setAudioStorage: React.Dispatch<React.SetStateAction<AudioStorage | null>>,
  tempo: MutableRefObject<number>,
): Promise<boolean> {
  if (!audioStorage) return false;
  const needsMidi: Stem[] = [];

  Object.keys(audioStorage as AudioStorage).forEach((value) => {
    const stem = audioStorage[value as Tracks];
    if (!stem.audioBlob) return;
    if (stem.midiBlob) return;
    needsMidi.push(stem);
  });

  if (needsMidi.length === 0) {
    return true;
  }
  console.log("Converting to MIDI", needsMidi);

  const needMidiSingle = needsMidi.shift();

  const midiResults = await convertToMidi(needMidiSingle!, tempo).then(
    (midiBlob) => {
      return {
        name: needMidiSingle?.name,
        midiBlob,
        audioBlob: needMidiSingle?.audioBlob,
      };
    },
  );

  setAudioStorage((prev) => {
    if (!prev) return prev;
    const updatedStorage: AudioStorage = { ...prev };
    const name = needMidiSingle?.name as Tracks;
    updatedStorage[name] = {
      ...updatedStorage[name],
      midiBlob: midiResults.midiBlob,
    };

    return updatedStorage;
  });
  return false;
}
