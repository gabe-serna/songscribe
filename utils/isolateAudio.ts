import JSZip from "jszip";
import { AudioStorage } from "./types";

export default async function isolateAudio(
  formData: FormData,
  setAudioStorage: React.Dispatch<React.SetStateAction<AudioStorage | null>>,
) {
  if (formData.get("separation_mode") === "Solo") await alignSingle();
  else await isolateTracks();

  async function isolateTracks() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/split-audio`,
      {
        method: "POST",
        mode: "cors",
        body: formData,
      },
    ).catch((error) => {
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        throw new Error(error.message);
      }
    });

    if (response) {
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
    } else throw new Error("0");

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
  }

  async function alignSingle() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/align-audio`,
      {
        method: "POST",
        mode: "cors",
        body: formData,
      },
    ).catch((error) => {
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        throw new Error(error.message);
      }
    });

    if (response) {
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
    } else throw new Error("0");

    const blob = await response.blob();
    setAudioStorage(
      (prev) =>
        ({
          ...prev,
          no_vocals: { name: "no_vocals", audioBlob: blob, midiBlob: null },
        }) as AudioStorage,
    );
  }
}
