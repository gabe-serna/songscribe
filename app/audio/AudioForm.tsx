"use client";
import { useContext, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import AudioPart1 from "@/app/audio/AudioPart1";
import { AudioContext } from "@/app/audio/AudioProvider";
import AudioPart2 from "./AudioPart2";

export default function AudioForm() {
  const { audioForm } = useContext(AudioContext);
  const isPart1Complete = audioForm.audio_file || audioForm.audio_link;
  const [isPart2Visible, setIsPart2Visible] = useState(false);

  useEffect(() => {
    if (audioForm.separation_mode) setIsPart2Visible(false);
  }, [audioForm]);

  return (
    <div className="flex pt-16">
      {/* <CSSTransition
        in={!isPart1Complete}
        timeout={700}
        classNames="fade"
        unmountOnExit
        onExited={() => setIsPart2Visible(true)}
      >
        <div className="flex flex-col items-center justify-center space-y-16">
          <h1 className="w-[15ch] text-center text-3xl font-bold lg:w-auto lg:text-4xl">
            The fastest way to turn any song into sheet music
          </h1>
          <AudioPart1 />
        </div>
      </CSSTransition> */}

      {/* <CSSTransition
        in={isPart2Visible}
        timeout={700}
        classNames="fade"
        unmountOnExit
      > */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-center text-3xl font-bold lg:text-4xl">
          Choose Isolation Mode
        </h1>
        <AudioPart2 />
      </div>
      {/* </CSSTransition> */}
    </div>
  );
}
