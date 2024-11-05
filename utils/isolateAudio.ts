import JSZip from "jszip";
import { AudioStorage } from "./types";

export default async function isolateAudio(
  formData: FormData,
  setAudioStorage: React.Dispatch<React.SetStateAction<AudioStorage | null>>,
) {
  if (formData.get("separation_mode") === "Solo") await alignSingle();
  else await isolateTracks();

  async function isolateTracks() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/split-audio`,
        {
          method: "POST",
          mode: "cors",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to isolate audio");
      }

      JSZip.loadAsync(response.blob()).then((zip) => {
        zip.forEach((relativePath, file) => {
          file.async("blob").then((blob) => {
            const name = relativePath.split(".")[0];
            setAudioStorage(
              (prev) =>
                ({
                  ...prev,
                  [name]: { name, audioBlob: blob, midiBlob: null },
                }) as AudioStorage,
            );
          });
        });
      });
      console.log("Audio isolated successfully");
    } catch (error) {
      console.error(error);
      alert("Error converting isolating audio");
    }
  }

  async function alignSingle() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/align-audio`,
        {
          method: "POST",
          mode: "cors",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to isolate audio");
      }

      const blob = await response.blob();
      setAudioStorage(
        (prev) =>
          ({
            ...prev,
            no_vocals: { name: "no_vocals", audioBlob: blob, midiBlob: null },
          }) as AudioStorage,
      );

      console.log("Audio aligned successfully");
    } catch (error) {
      console.error(error);
      alert("Error converting aligning audio");
    }
  }
}
