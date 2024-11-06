"use client";
import { useContext, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { AudioContext } from "@/app/audio/AudioProvider";
import AudioPart1 from "@/app/audio/AudioPart1";
import AudioPart2 from "@/app/audio/AudioPart2";
import AudioPart3 from "@/app/audio/AudioPart3";
import getTempo from "@/utils/getTempo";
import isolateAudio from "@/utils/isolateAudio";

export default function AudioForm() {
  const { audioForm, setAudioStorage, songName } = useContext(AudioContext);
  const isPart1Complete = audioForm.audio_file || audioForm.audio_link;
  const [isPart2Visible, setIsPart2Visible] = useState(false);
  const [isPart3Visible, setIsPart3Visible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (audioForm.separation_mode) setIsPart2Visible(false);
  }, [audioForm]);

  useEffect(() => {
    if (!isSubmitting) return;
    if (isSubmitting) setIsPart3Visible(false);

    // Set Tempo
    async function submitForm() {
      console.log("submitting form");
      // // get file if yt url
      // if (audioForm.audio_link && !audioForm.audio_file) {
      //   //add things in here
      // }

      // if (!audioForm.audio_file) return;

      // // Get Tempo
      // if (!audioForm.tempo) {
      //   audioForm.tempo = await getTempo(audioForm.audio_file);
      // }
      // console.log("tempo: ", audioForm.tempo);
      // songName.current = file.name.split(".")[0];

      // // Create Form Data
      // const formData = new FormData();
      // formData.append("audio_file", audioForm.audio_file);
      // formData.append("separation_mode", `${audioForm.separation_mode}`);
      // formData.append("tempo", `${audioForm.tempo}`);
      // if (audioForm.start_time)
      //   formData.append("start_time", `${audioForm.start_time}`);
      // if (audioForm.end_time)
      //   formData.append("end_time", `${audioForm.end_time}`);

      // // Make API Request
      // isolateAudio(formData, setAudioStorage).then(() => {
      //   setIsSubmitting(false);
      // });
    }
    submitForm();
  }, [isSubmitting]);

  return (
    <div className="flex h-max">
      <CSSTransition
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
      </CSSTransition>

      <CSSTransition
        in={isPart2Visible}
        timeout={700}
        classNames="fade"
        onExited={() => setIsPart3Visible(true)}
        unmountOnExit
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Choose Isolation Mode
          </h1>
          <AudioPart2 />
        </div>
      </CSSTransition>

      <CSSTransition
        in={isPart3Visible}
        timeout={700}
        classNames="fade"
        onExited={() => setisLoading(true)}
        unmountOnExit
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Customize Optional Parameters
          </h1>
          <AudioPart3 setIsSubmitting={setIsSubmitting} />
        </div>
      </CSSTransition>

      <CSSTransition
        in={isLoading}
        timeout={700}
        classNames="fade"
        unmountOnExit
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Loading...
          </h1>
          {/* <LoadingFacts/> */}
        </div>
      </CSSTransition>
    </div>
  );
}
