import React, { useState } from "react";
import ModeSelector from "@/components/ModeSelector";
import type { SeparationMode } from "@/utils/types";
import { Button } from "@/components/ui/button";

const modes: SeparationMode[] = ["Solo", "Duet", "Small Band", "Full Band"];

export default function AudioPart2() {
  const [hoveredMode, setHoveredMode] = useState<SeparationMode | null>(null);
  const [selectedMode, setSelectedMode] = useState<SeparationMode | null>(null);

  return (
    <form className="flex w-full flex-col items-center justify-center">
      {modes.map((mode) => (
        <ModeSelector
          key={mode}
          mode={mode}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          hoveredMode={hoveredMode}
          setHoveredMode={setHoveredMode}
        />
      ))}
      <Button
        className={`mt-4 w-full rounded-full bg-accent text-base font-semibold text-foreground shadow-lg hover:bg-accent dark:shadow-stone-900 lg:w-3/4 ${selectedMode ? "transition-visible" : "transition-invisible"}`}
      >
        Next
      </Button>
    </form>
  );
}
