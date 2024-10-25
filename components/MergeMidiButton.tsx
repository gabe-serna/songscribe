"use client";

import { AudioStorage, Stem } from "@/app/audio/page";
import { Button } from "./ui/button";
import mergeMidi from "@/utils/mergeMidi";
import { useRef, useState } from "react";

export default function MergeMidiButton({
  audioStorage,
}: {
  audioStorage: AudioStorage | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const message = useRef<String | null>(null);

  const merge = async () => {
    setIsSubmitting(true);
    if (!audioStorage) {
      message.current = "No audio tracks to merge.";
      setIsSubmitting(false);
      return;
    }

    try {
      const midiFiles = await Promise.all(
        Object.entries(audioStorage as Record<keyof AudioStorage, Stem>).map(
          async ([_, stem]) => {
            const stemMidi = stem.midiBlob as Blob;
            return (await stemMidi.arrayBuffer()) as ArrayBuffer;
          },
        ),
      );

      const songMidi = await mergeMidi(midiFiles);
      const blob = new Blob([songMidi], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "TranscribedSong.mid";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      message.current = "Failed to merge midi files.";
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={merge}>Merge Midi</Button>
      {message.current && <p>{message.current}</p>}
    </>
  );
}
