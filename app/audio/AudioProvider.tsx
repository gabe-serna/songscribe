"use client";
import { AudioStorage } from "@/utils/types";
import React, {
  useState,
  ReactNode,
  createContext,
  useRef,
  MutableRefObject,
} from "react";

// Define the shape of the context
interface AudioContextType {
  audioStorage: AudioStorage | null;
  setAudioStorage: React.Dispatch<React.SetStateAction<AudioStorage | null>>;
  tempo: MutableRefObject<number>;
  songName: MutableRefObject<string>;
}

// Create the context with default values
export const AudioContext = createContext<AudioContextType>({
  audioStorage: null,
  setAudioStorage: () => {},
  tempo: { current: 120 },
  songName: { current: "" },
});

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioStorage, setAudioStorage] = useState<AudioStorage | null>(null);
  const songName = useRef("");
  const tempo = useRef(120);

  return (
    <AudioContext.Provider
      value={{ audioStorage, setAudioStorage, tempo, songName }}
    >
      {children}
    </AudioContext.Provider>
  );
};
