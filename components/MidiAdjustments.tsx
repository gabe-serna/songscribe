"use client";
import MidiSlider from "@/components/MidiSlider";
import { Button } from "@/components/ui/button";
import { useScreenSize } from "@/hooks/use-screen-size";
import { FormEvent, useState } from "react";

export default function MidiAdjustments({
  handleSubmit,
}: {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [reset, setReset] = useState(false);
  const screenSize = useScreenSize();
  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReset((prev) => !prev);
  };

  return (
    <form
      className="grid grid-cols-2 gap-4 gap-x-8 xl:grid-cols-1"
      onReset={handleReset}
      onSubmit={handleSubmit}
    >
      <MidiSlider
        name="Minimum Note Length"
        defaultValue={130}
        max={500}
        min={0}
        step={20}
        resetSignal={reset}
      />
      <MidiSlider
        name="Minimum Frequency"
        defaultValue={0}
        max={2000}
        min={0}
        step={100}
        resetSignal={reset}
        outputNote
      />
      <MidiSlider
        name="Maximum Frequency"
        defaultValue={13000}
        max={13000}
        min={100}
        step={100}
        resetSignal={reset}
        outputNote
      />
      <MidiSlider
        // Onset Threshold
        name="Note Segmentation"
        defaultValue={0.5}
        max={0.95}
        min={0.05}
        step={0.05}
        resetSignal={reset}
      />
      <MidiSlider
        // Frame Threshold
        name="Confidence Threshold"
        defaultValue={0.3}
        max={0.95}
        min={0.05}
        step={0.05}
        resetSignal={reset}
      />
      <Button
        size="sm"
        type="reset"
        className="button-secondary rounded-3xl border-2 border-border font-semibold max-xl:col-start-1"
      >
        Reset
      </Button>
      <Button size="sm" className="button-primary rounded-3xl font-semibold">
        Regenerate {screenSize != "xs" ? "Midi" : ""}
      </Button>
    </form>
  );
}
