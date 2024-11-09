import React, { useRef, useState, useEffect, PointerEventHandler } from "react";
import { Knob, Pointer } from "rc-knob";
import { CustomArc } from "./CustomArc";

interface Props {
  value: number;
  setValue: (value: number) => void;
}

const PanKnob = ({ value, setValue }: Props) => {
  const min = -100;
  const max = 100;
  const size = 40;
  const arcWidth = size * 0.15;
  const arcRadius = size / 2 - arcWidth / 2;
  const pointerSize = size * 0.08;
  const pointerRadius = arcRadius - pointerSize;

  const knobRef = useRef<HTMLDivElement>(null);
  const currentVal = useRef(value);
  const [isDragging, setIsDragging] = useState(false);
  const totalAngle = useRef(0);
  const lastAngle = useRef(0);
  const [startValue, setStartValue] = useState(value);

  // Function to handle pointer down
  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);

    lastAngle.current = angle;
    totalAngle.current = 0;
    setStartValue(value);
    setIsDragging(true);
    e.preventDefault();
  };

  // Function to handle pointer move and calculate value
  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging || !knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
    let deltaAngle = angle - lastAngle.current;

    // Adjust for angle wrapping
    if (deltaAngle > Math.PI) {
      deltaAngle -= 2 * Math.PI;
    } else if (deltaAngle < -Math.PI) {
      deltaAngle += 2 * Math.PI;
    }

    totalAngle.current += deltaAngle;
    lastAngle.current = angle;

    // Map totalAngle to value
    const totalAngleRangeRadians = (280 * Math.PI) / 180; // 280 degrees in radians
    const valueRange = max - min; // 200
    let newValue =
      startValue + (totalAngle.current / totalAngleRangeRadians) * valueRange;

    let finalValue = Math.round(newValue / 10) * 10;

    // Format Final Value
    if (finalValue < min) finalValue = min;
    else if (finalValue > max) finalValue = max;
    if (Math.abs(currentVal.current - finalValue) > 50) return;

    setValue(finalValue);
  };

  // Function to handle pointer up
  const handlePointerUp = () => setIsDragging(false);

  // Manage adding and removing pointer event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    } else {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (value === currentVal.current) return;
    currentVal.current = value;
  }, [value]);

  return (
    <div
      ref={knobRef}
      onPointerDown={handlePointerDown}
      className="mt-3 flex touch-none flex-col items-center"
    >
      <Knob
        size={size}
        angleOffset={-140}
        angleRange={280}
        min={min}
        max={max}
        snap={true}
        steps={10}
        value={value}
        onChange={(val) => {
          if (Math.abs(value - val) > 50) return;
          setTimeout(() => setValue(Math.round(val / 10) * 10), 10);
        }}
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
          className={`mt-1 w-12 text-center text-card-foreground ${
            value < 0 ? "-translate-x-[0.1875rem]" : ""
          }`}
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

export default PanKnob;
