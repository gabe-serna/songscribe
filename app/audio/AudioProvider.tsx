"use client";
import { AudioFormData, AudioStorage } from "@/utils/types";
import React, {
  useState,
  ReactNode,
  createContext,
  useRef,
  MutableRefObject,
} from "react";

// Define the shape of the context
interface AudioContextType {
  audioForm: AudioFormData;
  setAudioForm: React.Dispatch<React.SetStateAction<AudioFormData>>;
  audioStorage: AudioStorage | null;
  setAudioStorage: React.Dispatch<React.SetStateAction<AudioStorage | null>>;
  songName: MutableRefObject<string>;
  songKey: MutableRefObject<string>;
  finalMidiFile: React.MutableRefObject<ArrayBuffer | null>;
}

// Create the context with default values
export const AudioContext = createContext<AudioContextType>({
  audioForm: {},
  setAudioForm: () => {},
  audioStorage: null,
  setAudioStorage: () => {},
  songName: { current: "" },
  songKey: { current: "" },
  finalMidiFile: { current: null },
});

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioForm, setAudioForm] = useState<AudioFormData>({});
  const [audioStorage, setAudioStorage] = useState<AudioStorage | null>(null);
  const songName = useRef("");
  const songKey = useRef("");
  const finalMidiFile = useRef<ArrayBuffer | null>(null);

  return (
    <AudioContext.Provider
      value={{
        audioForm,
        setAudioForm,
        audioStorage,
        setAudioStorage,
        songName,
        songKey,
        finalMidiFile,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
