import JSZip from "jszip";
import { AudioStorage } from "./types";

export async function zipAllParts(
  audioStorage: AudioStorage,
  songName: string,
): Promise<void> {
  const zip = new JSZip();

  for (const key in audioStorage) {
    if (audioStorage[key as keyof AudioStorage]) {
      const stem = audioStorage[key as keyof AudioStorage];

      // Add audioBlob if it exists
      if (stem.audioBlob) {
        zip.file(`${stem.name}_audio.mp3`, stem.audioBlob);
      }

      // Add midiBlob if it exists
      if (stem.midiBlob) {
        zip.file(`${stem.name}_midi.mid`, stem.midiBlob);
      }
    }
  }

  // Generate the zip file and create a download link
  const zipFile = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipFile);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${songName}_parts.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
