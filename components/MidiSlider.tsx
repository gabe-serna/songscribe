"use client";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import getNoteName from "@/utils/getNoteName";
import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  defaultValue: number;
  max: number;
  min: number;
  step: number;
  resetSignal: boolean;
  className?: string;
  outputNote?: boolean;
}

export default function MidiSlider({
  name,
  defaultValue,
  max,
  min,
  step,
  resetSignal,
  className,
  outputNote = false,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const htmlName = name.toLowerCase().replace(/\s/g, "_");
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [resetSignal]);

  return (
    <span className={className}>
      <Label htmlFor={htmlName}>{name}</Label>
      <div className="flex h-max items-center justify-center gap-4 *:mt-1">
        <Slider
          ref={sliderRef}
          name={htmlName}
          defaultValue={[defaultValue]}
          value={[value]}
          max={max}
          min={min}
          step={step}
          onValueChange={(val) => setValue(val[0])}
        />
        <p className="w-14 select-none text-right text-card-foreground">
          {!outputNote ? value : getNoteName(value)}
        </p>
      </div>
    </span>
  );
}
