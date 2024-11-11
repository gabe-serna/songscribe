"use client";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import getNoteName from "@/utils/getNoteName";
import sliderFrequencyScaling from "@/utils/sliderFrequencyScaling";
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
  const htmlName = name.toLowerCase().replace(/\s/g, "_");
  const sliderRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<number>(defaultValue); // Actual frequency in Hz
  const [valueIndex, setValueIndex] = useState<number>(0); // Index in customFrequencies
  const [customFrequencies, setCustomFrequencies] = useState<number[]>([]);

  // Initialize custom frequencies if outputNote is true
  useEffect(() => {
    if (outputNote) {
      const frequencies = sliderFrequencyScaling();
      setCustomFrequencies(frequencies);

      // Find the closest frequency index to the defaultValue
      const closestIndex = frequencies.reduce(
        (prev, curr, idx) =>
          Math.abs(curr - defaultValue) <
          Math.abs(frequencies[prev] - defaultValue)
            ? idx
            : prev,
        0,
      );
      setValue(frequencies[closestIndex]);
      setValueIndex(closestIndex);
    } else {
      setValue(defaultValue);
      setValueIndex(0);
    }
  }, [outputNote, defaultValue]);

  // Handle resetSignal
  useEffect(() => {
    if (outputNote) {
      const frequencies = sliderFrequencyScaling();
      const closestIndex = frequencies.reduce(
        (prev, curr, idx) =>
          Math.abs(curr - defaultValue) <
          Math.abs(frequencies[prev] - defaultValue)
            ? idx
            : prev,
        0,
      );
      setValue(frequencies[closestIndex]);
      setValueIndex(closestIndex);
    } else {
      setValue(defaultValue);
      setValueIndex(0);
    }
  }, [resetSignal, defaultValue, outputNote]);

  // Determine slider parameters based on outputNote
  const sliderMin = outputNote ? 0 : min;
  const sliderMax = outputNote ? customFrequencies.length - 1 : max;
  const sliderStep = outputNote ? 1 : step;

  // Handle slider value change
  const handleValueChange = (val: number[]) => {
    if (outputNote) {
      const index = val[0];
      setValue(customFrequencies[index]);
      setValueIndex(index);
    } else {
      setValue(val[0]);
    }
  };

  // Determine the display value
  const displayValue = outputNote
    ? getNoteName(value)
    : value % 1 === 0
      ? value
      : value.toFixed(2);

  return (
    <span className={className}>
      <Label htmlFor={htmlName}>{name}</Label>
      <div className="mt-1 flex h-max items-center justify-center gap-4">
        <Slider
          ref={sliderRef}
          name={htmlName}
          defaultValue={outputNote ? [valueIndex] : [defaultValue]}
          value={outputNote ? [valueIndex] : [value]}
          max={sliderMax}
          min={sliderMin}
          step={sliderStep}
          onValueChange={handleValueChange}
        />
        <p className="w-14 select-none text-right text-card-foreground">
          {displayValue}
        </p>
      </div>
    </span>
  );
}
