"use client";

import { Button } from "./ui/button";
import mergeMidi from "@/utils/mergeMidi";
import { useRef, useState } from "react";
import { createScore } from "@/utils/flat";
import { AudioStorage, Stem } from "@/utils/types";

interface Props {
  audioStorage: AudioStorage | null;
  tempo: number;
  songName: string;
  setFlatScore: (score: string) => void;
}

export default function MergeMidiButton({
  audioStorage,
  tempo,
  songName,
  setFlatScore,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const message = useRef<String | null>(null);

  const merge = async () => {
    setIsSubmitting(true);
    message.current = null;
    if (!audioStorage) {
      message.current = "No audio tracks to merge.";
      setIsSubmitting(false);
      return;
    }

    try {
      const names = Object.keys(audioStorage);
      console.log("names", names);

      const midiFiles = await Promise.all(
        Object.entries(audioStorage as Record<keyof AudioStorage, Stem>).map(
          async ([_, stem]) => {
            const stemMidi = stem.midiBlob as Blob;
            return (await stemMidi.arrayBuffer()) as ArrayBuffer;
          },
        ),
      );

      const songMidi = await mergeMidi(midiFiles, tempo, names, songName);
      const blob = new Blob([songMidi], { type: "application/octet-stream" });
      // const url = URL.createObjectURL(blob);
      console.log("creating flat score...");
      const response = await createScore(blob, songName);
      console.log("flat.io response: ", response);
      setFlatScore(response.id);

      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "TranscribedSong.mid";
      // a.click();
      // URL.revokeObjectURL(url);
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
