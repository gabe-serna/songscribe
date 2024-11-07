"use client";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface Props {
  name: string;
  defaultValue: number;
  max: number;
  min: number;
  step: number;
}

export default function MidiAdjustment({
  name,
  defaultValue,
  max,
  min,
  step,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const htmlName = name.toLowerCase().replace(" ", "_");
  return (
    <span>
      <Label htmlFor={htmlName}>{name}</Label>
      <div className="flex h-max items-center justify-center gap-4 *:mt-1">
        <Slider
          name={htmlName}
          defaultValue={[defaultValue]}
          max={max}
          min={min}
          step={step}
          onValueChange={(val) => setValue(val[0])}
        />
        <p className="w-14 text-right text-card-foreground">{value}</p>
      </div>
    </span>
  );
}
