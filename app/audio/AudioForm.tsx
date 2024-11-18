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
import Loading from "@/components/Loading";

export default function AudioForm({
  setFormComplete,
}: {
  setFormComplete: (value: boolean) => void;
}) {
  const { audioForm, setAudioForm, setAudioStorage, songName } =
    useContext(AudioContext);
  const [isPart2Visible, setIsPart2Visible] = useState(false);
  const [isPart3Visible, setIsPart3Visible] = useState(false);
  const [isLoadingVisible, setisLoadingVisible] = useState(false);
  const [isLoadingFinished, setisLoadingFinished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPart1Complete =
    audioForm.audio_file != undefined ||
    audioForm.audio_link != undefined ||
    !isLoadingFinished;
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
      try {
        console.log("submitting form");
        // Get File if YT Link
        let file = audioForm.audio_file;
        if (audioForm.audio_link && !file) {
          const formData = new FormData();
          formData.append("youtube_url", audioForm.audio_link);
          file = await getAudioFromURL(formData, setAudioForm);
        }

        if (!file) {
          // This shouldn't happen
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
        await isolateAudio(formData, setAudioStorage);

        // Success case
        setTimeout(() => {
          setIsSubmitting(false);
          setisLoadingVisible(false);
        }, 2000);
      } catch (error: any) {
        setAudioForm({});
        setIsSubmitting(false);
        setisLoadingVisible(false);
        let message: string;

        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("ERR_CONNECTION_REFUSED")
        ) {
          message = "Make sure the backend server is running.";
        } else {
          switch (error.message) {
            case "404":
              message = "Endpoint not Found.";
              break;
            case "400":
              if (audioForm.audio_link) {
                message =
                  "Bad Request. Make sure the song is no longer than 6 minutes.";
              } else {
                message = "Invalid Form Data.";
              }
              break;
            case "422":
              message = "Invalid Form Syntax.";
              break;
            case "500":
              message = "Internal Server Error.";
              break;
            default:
              message = "Failed to isolate audio.";
              break;
          }
        }
        toast({
          variant: "destructive",
          title: "Uh oh! Error Isolating Audio!",
          description: message,
        });
      }
    }
    submitForm();
  }, [isSubmitting]);

  return (
    <div className="mb-20 flex h-max">
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
          <h1 className="w-[15ch] text-center text-3xl font-bold md:w-auto md:text-4xl">
            Upload the song you want to transcribe
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
          <h1 className="text-center text-3xl font-bold md:text-4xl">
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
        onExited={() => {
          setisLoadingVisible(true);
          setisLoadingFinished(false);
          setIsSubmitting(true);
        }}
        unmountOnExit
      >
        <div
          ref={part3Ref}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Customize Optional Parameters
          </h1>
          <AudioPart3 setIsPart3Visible={setIsPart3Visible} />
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={loadingRef}
        in={isLoadingVisible}
        timeout={700}
        classNames="fade"
        onExited={() => {
          if (
            audioForm.audio_file != undefined ||
            audioForm.audio_link != undefined
          ) {
            setFormComplete(true);
          }
          setisLoadingFinished(true);
        }}
        unmountOnExit
      >
        <div
          ref={loadingRef}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <Loading />
        </div>
      </CSSTransition>
    </div>
  );
}
