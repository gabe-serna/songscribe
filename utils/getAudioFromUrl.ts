import { AudioFormData } from "./types";

export default async function getAudioFromURL(
  formData: FormData,
  setAudioForm: React.Dispatch<React.SetStateAction<AudioFormData>>,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/yt-to-mp3`,
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
    const file = new File([blob], "youtube_audio.mp3", { type: blob.type });
    setAudioForm((prev) => ({ ...prev, audio_file: file }));

    console.log("YT audio retrieved successfully");
    return file;
  } catch (error) {
    console.error(error);
    alert("Error retrieving YT audio");
  }
}
