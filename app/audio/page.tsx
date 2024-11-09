"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { AudioContext } from "./AudioProvider";
import AudioForm from "./AudioForm";
import handleMidiConversion from "@/utils/getMidi";
import MidiEditor from "./MidiEditor";

export default function Page() {
  const { audioForm, audioStorage, setAudioStorage, songName } =
    useContext(AudioContext);
  const [flatScore, setFlatScore] = useState<string | null>(null);
  const [formComplete, setFormComplete] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isMidiComplete, setIsMidiComplete] = useState(false);
  const [isEditingComplete, setIsEditingComplete] = useState(false);
  const flatRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Convert to Midi
  useEffect(() => {
    if (isConverting) {
      setIsMidiComplete(false);
      return;
    }
    handleMidiConversion(
      audioStorage,
      setAudioStorage,
      audioForm.tempo as number,
    ).then((isComplete) => {
      if (isComplete) {
        setIsMidiComplete(true);
      }
    });
  }, [audioStorage]);

  // Create Flat Score
  useEffect(() => {
    const container = flatRef.current;
    console.log("flatScore has been updated:", flatScore);
    console.log("container:", container);
    if (!container || !flatScore) return;
    console.log("Creating Flat.io embed");
    import("flat-embed")
      .then(({ default: Embed }) => {
        new Embed(container, {
          score: flatScore,
          embedParams: {
            appId: process.env.NEXT_PUBLIC_FLAT_APP_ID,
            controlsPosition: "bottom",
          },
        });
      })
      .catch((error) => {
        console.error("Failed to load flat-embed:", error);
      });
  }, [flatScore, isEditingComplete]);
  console.log("flatRef:", flatRef);

  // Warn user before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div
      className="flex w-full max-w-[1200px] flex-col items-center justify-around px-8 sm:px-20 xl:px-0"
      id="resize container"
    >
      {!formComplete && <AudioForm setFormComplete={setFormComplete} />}
      <CSSTransition
        nodeRef={editorRef}
        in={formComplete && !flatScore}
        timeout={700}
        classNames="fade"
        onExited={() => setIsEditingComplete(true)}
        unmountOnExit
      >
        <MidiEditor
          ref={editorRef}
          conversionFlag={setIsConverting}
          isMidiComplete={isMidiComplete}
          setFlatScore={setFlatScore}
        />
      </CSSTransition>
      <CSSTransition
        nodeRef={flatRef}
        in={isEditingComplete}
        timeout={700}
        classNames="fade"
        unmountOnExit
      >
        <div
          ref={flatRef}
          className="h-[75vh] w-full overflow-hidden rounded-3xl shadow-lg dark:shadow-stone-900"
        />
      </CSSTransition>
    </div>
  );
}
