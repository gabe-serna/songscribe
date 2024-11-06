"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { AudioContext } from "@/app/audio/AudioProvider";
import AudioPart1 from "@/app/audio/AudioPart1";
import AudioPart2 from "@/app/audio/AudioPart2";
import AudioPart3 from "@/app/audio/AudioPart3";
import getTempo from "@/utils/getTempo";
import isolateAudio from "@/utils/isolateAudio";
import getAudioFromURL from "@/utils/getAudioFromUrl";
import { useToast } from "@/hooks/use-toast";

export default function AudioForm() {
  const { audioForm, setAudioForm, setAudioStorage, songName } =
    useContext(AudioContext);
  const isPart1Complete = audioForm.audio_file || audioForm.audio_link;
  const [isPart2Visible, setIsPart2Visible] = useState(false);
  const [isPart3Visible, setIsPart3Visible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const part1Ref = useRef(null);
  const part2Ref = useRef(null);
  const part3Ref = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    if (audioForm.separation_mode) setIsPart2Visible(false);
  }, [audioForm]);

  useEffect(() => {
    if (!isSubmitting) return;
    if (isSubmitting) setIsPart3Visible(false);

    // Set Tempo
    async function submitForm() {
      console.log("submitting form");
      try {
        // Get File if YT Link
        let file = audioForm.audio_file;
        if (audioForm.audio_link && !file) {
          const formData = new FormData();
          formData.append("youtube_url", audioForm.audio_link);
          file = await getAudioFromURL(formData, setAudioForm);
        }

        if (!file) {
          setIsSubmitting(false);
          throw new Error("No audio file provided");
        }
        console.log("audio retrieved: ", file.name);

        // Get Tempo
        let tempo = 120;
        if (!audioForm.tempo) {
          tempo = await getTempo(file);
          setAudioForm({ ...audioForm, tempo });
        } else tempo = audioForm.tempo;
        console.log("tempo: ", tempo);
        songName.current = file.name.split(".")[0];

        // Create Form Data
        const formData = new FormData();
        formData.append("audio_file", file);
        formData.append("separation_mode", `${audioForm.separation_mode}`);
        formData.append("tempo", `${tempo}`);
        if (audioForm.start_time)
          formData.append("start_time", `${audioForm.start_time}`);
        if (audioForm.end_time)
          formData.append("end_time", `${audioForm.end_time}`);

        // Make API Request
        isolateAudio(formData, setAudioStorage).then(() => {
          setIsSubmitting(false);
        });
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Error Isolating Audio!",
          description: "Make sure you have the backend running locally.",
        });
      }
    }
    submitForm();
  }, [isSubmitting]);

  return (
    <div className="flex h-max">
      <CSSTransition
        nodeRef={part1Ref}
        in={!isPart1Complete}
        timeout={700}
        classNames="fade"
        unmountOnExit
        onExited={() => setIsPart2Visible(true)}
      >
        <div
          ref={part1Ref}
          className="flex flex-col items-center justify-center space-y-16"
        >
          <h1 className="w-[15ch] text-center text-3xl font-bold lg:w-auto lg:text-4xl">
            The fastest way to turn any song into sheet music
          </h1>
          <AudioPart1 />
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={part2Ref}
        in={isPart2Visible}
        timeout={700}
        classNames="fade"
        onExited={() => setIsPart3Visible(true)}
        unmountOnExit
      >
        <div
          ref={part2Ref}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Choose Isolation Mode
          </h1>
          <AudioPart2 />
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={part3Ref}
        in={isPart3Visible}
        timeout={700}
        classNames="fade"
        onExited={() => setisLoading(true)}
        unmountOnExit
      >
        <div
          ref={part3Ref}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Customize Optional Parameters
          </h1>
          <AudioPart3 setIsSubmitting={setIsSubmitting} />
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={loadingRef}
        in={isLoading}
        timeout={700}
        classNames="fade"
        unmountOnExit
      >
        <div
          ref={loadingRef}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Loading...
          </h1>
          {/* <LoadingFacts/> */}
        </div>
      </CSSTransition>
    </div>
  );
}
