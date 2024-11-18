import { AudioFormData } from "./types";

export default async function getAudioFromURL(
  formData: FormData,
  setAudioForm: React.Dispatch<React.SetStateAction<AudioFormData>>,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/yt-to-mp3`,
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
      const message = await response.json();
      if (message.error.includes("bot")) {
        throw new Error("401");
      } else throw new Error(`${response.status}`);
    }
  } else throw new Error("0");

  const blob = await response.blob();
  const file = new File([blob], "youtube_audio.mp3", { type: blob.type });
  setAudioForm((prev) => ({ ...prev, audio_file: file }));

  return file;
}
