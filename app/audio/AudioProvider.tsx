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
}

// Create the context with default values
export const AudioContext = createContext<AudioContextType>({
  audioForm: {},
  setAudioForm: () => {},
  audioStorage: null,
  setAudioStorage: () => {},
  songName: { current: "" },
});

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioForm, setAudioForm] = useState<AudioFormData>({});
  const [audioStorage, setAudioStorage] = useState<AudioStorage | null>(null);
  const songName = useRef("");

  return (
    <AudioContext.Provider
      value={{
        audioForm,
        setAudioForm,
        audioStorage,
        setAudioStorage,
        songName,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
