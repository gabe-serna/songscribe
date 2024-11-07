import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Knob, Pointer, Scale, Arc, Value } from "rc-knob";
import { useState } from "react";

export default function AudioMixer({ name }: { name: string }) {
  const defaultValue = [50];
  const [value, setValue] = useState(defaultValue);
  const htmlName = name.toLowerCase().replace(" ", "_");

  return (
    <div className="flex h-full w-max flex-col-reverse items-center justify-center">
      <Label htmlFor={htmlName} className="mt-4">
        {name}
      </Label>
      {/* <Knob
        size={100}
        angleOffset={220}
        angleRange={280}
        steps={10}
        snap={true}
        min={0}
        max={100}
        // onChange={(value) => console.log(value)}
      >
        <Arc arcWidth={5} color="#FC5A96" radius={47.5} />
        <Pointer width={5} radius={40} type="circle" color="#FC5A96" />
        <Value marginBottom={40} className="value" />
      </Knob> */}
      <p className="w-14 text-center text-card-foreground">{value}</p>
      <Slider
        name={htmlName}
        min={0}
        max={100}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => setValue(val)}
        orientation="vertical"
      />
    </div>
  );
}
