import React from "react";

interface Props {
  className?: string;
}

export default function Bass({ className }: Props) {
  const stroke = className?.includes("stroke") ? "" : "stroke-black";
  return (
    <svg
      // Set default styles and allow overrides via className
      className={`fill-none ${stroke} stroke-2 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>bass-svg</title>
      <g id="Layer 1">
        <path fillRule="evenodd" d="m11.5 12.5l4.9-4.9" />
        <path
          fillRule="evenodd"
          d="m21.2 2.9c-0.1-0.1-0.5-0.2-0.6-0.2-0.1-0.1-0.1-0.1-0.4-0.1q-0.2 0-0.3 0.1-0.2 0.1-0.4 0.2l-1.9 1.7c-0.2 0-0.4 0.2-0.5 0.3-0.1 0.1-0.2 0.2-0.3 0.3q0 0.2-0.1 0.3 0 0.2 0 0.4l0.2 0.5c0 0 0 0.3 0 0.3 0 0 0 0.1-0.1 0.2q0 0.2-0.1 0.4-0.1 0.1-0.3 0.3 0.2-0.2 0.3-0.3 0.2-0.1 0.4-0.1 0.1-0.1 0.3-0.2c0.2 0 0.5 0.1 0.6 0.1h0.6q0.2 0 0.3 0 0.2 0 0.4-0.1 0.2-0.1 0.4-0.2c0.1-0.1 0.2-0.1 0.3-0.3 0.2-0.3 0.3-0.7 0.6-1.1 0 0 0.1-0.2 0.7-0.6 0.1-0.1 0.6-0.1 0.6-0.2 0-0.2 0.1-0.2 0-0.3 0-0.1 0-0.4-0.1-0.7-0.2-0.4-0.6-0.7-0.6-0.7z"
        />
        <path d="m6 16l2 2" />
        <path id="Layer copy" fillRule="evenodd" d="m9 14l1 1" />
        <path
          fillRule="evenodd"
          d="m8.1 9.2c1.5-3.4 3.5-3.6 4.2-2.5 0.7 1.2-0.9 2.3 0 3.4 0.7 1 2.1-0.2 1 0.7-2 1.7 2.2 0.1 3.2 1.5 0.6 0.8-0.2 2.3-1.4 2.7l-1.7 0.7c-0.6 0.3-0.6 0.4-0.8 0.5-0.1 0.1-0.2 0.6-0.2 0.6-0.1 0.3-0.1 0.3-0.1 0.9 0 0.2 0 0.5 0 0.6 0 0.5 0 0.8-0.2 1.5-0.2 0.5-0.4 1.1-0.9 1.5-0.4 0.5-0.7 0.6-1.2 0.7-0.6 0.2-1.3 0.3-2 0.1-3-0.9-5.8-3.4-6.2-6.3 0-0.5 0.1-1.3 0.3-1.8 0.3-0.4 0.5-0.8 1.1-1.1 0.4-0.2 0.8-0.4 1.3-0.6 0.5-0.2 0.6-0.3 1.1-0.5 0.2-0.1 0.5-0.2 0.7-0.3q0.2-0.1 0.5-0.2 0.2-0.2 0.4-0.4 0.2-0.2 0.3-0.5z"
        />
      </g>
    </svg>
  );
}
