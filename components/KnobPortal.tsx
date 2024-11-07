"use client";
import React from "react";
import { createPortal } from "react-dom";
import { Knob, Pointer, Scale, Arc, Value } from "rc-knob";

interface KnobPortalProps {
  value: number;
  onChange: (value: number) => void;
}

const KnobPortal: React.FC<KnobPortalProps> = ({ value, onChange }) => {
  return createPortal(
    <Knob
      size={100}
      angleOffset={220}
      angleRange={280}
      steps={10}
      snap={true}
      min={0}
      max={100}
      value={value}
      onChange={onChange}
      ariaLabelledBy="knob-label"
      ariaValueText={`Value: ${value}`}
    >
      <Arc arcWidth={5} color="#FC5A96" radius={47.5} />
      <Pointer width={5} radius={40} type="circle" color="#FC5A96" />
      <Value marginBottom={40} className="value" />
    </Knob>,
    document.body, // Render the Knob at the end of the body
  );
};

export default KnobPortal;
