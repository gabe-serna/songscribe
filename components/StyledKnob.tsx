// StyledKnob.tsx
import React, { useState } from "react";
import { Knob, Pointer } from "rc-knob";
import { CustomArc } from "./CustomArc";

const StyledKnob: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const min = -100;
  const max = 100;
  const size = 40; // Desired knob size
  const arcWidth = size * 0.15; // 10% of size = 5
  const pointerSize = size * 0.08; // 10% of size = 5

  // Calculate radii
  const arcRadius = size / 2 - arcWidth / 2; // 25 - 2.5 = 22.5
  const pointerRadius = arcRadius - pointerSize; // 22.5 - 2.5 = 20

  return (
    <div className="mt-3 flex flex-col items-center">
      <Knob
        size={size}
        angleOffset={-140}
        angleRange={280}
        min={min}
        max={max}
        snap={true}
        steps={10}
        value={value}
        onChange={(val) => setValue(Math.round(val / 10) * 10)}
      >
        {/* Background Arc */}
        <CustomArc
          value={min}
          min={min}
          max={max}
          size={size}
          radius={arcRadius}
          arcWidth={arcWidth}
          angleOffset={-140}
          angleRange={280}
          color="#ffffff"
          className="stroke-secondary"
        />
        <CustomArc
          value={max}
          min={min}
          max={max}
          size={size}
          radius={arcRadius}
          arcWidth={arcWidth}
          angleOffset={-140}
          angleRange={280}
          color="#ffffff"
          className="stroke-secondary"
        />
        {/* Value Arc */}
        <CustomArc
          value={value}
          min={min}
          max={max}
          size={size}
          radius={arcRadius}
          arcWidth={arcWidth}
          angleOffset={-140}
          angleRange={280}
          color="#FF0000"
          className="stroke-pink-500 dark:stroke-pink-400"
        />
        {/* Circular Pointer */}
        <Pointer
          width={pointerSize}
          height={pointerSize}
          radius={pointerRadius}
          type="circle"
          color="#FC5A96"
          className="fill-transparent"
        />
      </Knob>
      {/* Display Current Value */}
      <div className="relative">
        <span className="absolute -left-1 -top-3 text-xs font-bold text-stone-400 dark:text-stone-500">
          L
        </span>
        <p
          className={`mt-1 w-12 text-center text-card-foreground ${value < 0 ? "-translate-x-[0.1875rem]" : ""}`}
        >
          {value.toFixed(0)}
        </p>
        <span className="absolute -right-1.5 -top-3 text-xs font-bold text-stone-400 dark:text-stone-500">
          R
        </span>
      </div>
    </div>
  );
};

export default StyledKnob;
