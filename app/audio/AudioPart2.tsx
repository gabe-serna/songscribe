import React, { useContext, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { AudioContext } from "@/app/audio/AudioProvider";
import type { SeparationMode } from "@/utils/types";
import ModeSelector from "@/components/ModeSelector";
import { Button } from "@/components/ui/button";

const modes: SeparationMode[] = ["Solo", "Duet", "Small Band", "Full Band"];

export default function AudioPart2() {
  const { audioForm, setAudioForm } = useContext(AudioContext);
  const [hoveredMode, setHoveredMode] = useState<SeparationMode | null>(null);
  const [selectedMode, setSelectedMode] = useState<SeparationMode | null>(null);

  const modeRefs = useRef<Array<React.RefObject<HTMLDivElement>>>(
    modes.map(() => React.createRef<HTMLDivElement>()),
  ).current;

  function handleModeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAudioForm({
      ...audioForm,
      separation_mode: selectedMode as SeparationMode,
    });
  }

  return (
    <form
      onSubmit={handleModeSubmit}
      className="flex w-full flex-col items-center justify-center"
    >
      <TransitionGroup component={null} appear>
        {modes.map((mode, index) => (
          <CSSTransition
            nodeRef={modeRefs[index]}
            in={selectedMode != null}
            key={mode}
            timeout={700 + index * 200}
            classNames="fade"
          >
            <ModeSelector
              ref={modeRefs[index]}
              index={index}
              mode={mode}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              hoveredMode={hoveredMode}
              setHoveredMode={setHoveredMode}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
      <Button
        type="submit"
        className={`mt-4 w-full rounded-full bg-accent text-base font-semibold text-foreground shadow-lg hover:bg-accent dark:shadow-stone-950 max-lg:text-lg sm:max-lg:py-6 lg:w-3/4 ${selectedMode ? "transition-visible" : "transition-invisible"}`}
      >
        Next
      </Button>
    </form>
  );
}
