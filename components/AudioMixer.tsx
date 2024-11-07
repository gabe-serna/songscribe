import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import StyledKnob from "@/components/StyledKnob";

export default function AudioMixer({ name }: { name: string }) {
  const defaultValue = [50];
  const [value, setValue] = useState(defaultValue);
  const htmlName = name.toLowerCase().replace(" ", "_");

  return (
    <div className="flex h-full w-max flex-col-reverse items-center justify-center">
      <StyledKnob />
      <Label htmlFor={htmlName} className="font-heading mt-4 font-bold">
        {name}
      </Label>
      <p className="w-14 text-center text-card-foreground">{value}</p>
      <Slider
        name={htmlName}
        min={0}
        max={100}
        step={5}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => setValue(val)}
        orientation="vertical"
      />
    </div>
  );
}
