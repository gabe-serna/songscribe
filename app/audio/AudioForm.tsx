"use client";
import { useContext, useEffect } from "react";
import AudioPart1 from "@/app/audio/AudioPart1";
import { AudioContext } from "@/app/audio/AudioProvider";

export default function AudioForm() {
  const { audioForm, setAudioForm } = useContext(AudioContext);
  const isPart1Complete = audioForm.audio_file || audioForm.audio_link;
  const isPart2Complete = audioForm.separation_mode;

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-16">
      {!isPart1Complete && (
        <>
          <h1 className="w-[15ch] text-center text-3xl font-bold lg:w-auto lg:text-4xl">
            The fastest way to turn any song into sheet music
          </h1>
          <AudioPart1 />
        </>
      )}
      {isPart1Complete && !isPart2Complete && <h2>Part 2</h2>}
    </div>
  );
}
