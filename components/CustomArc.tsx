// CustomArc.tsx
import React from "react";

interface CustomArcProps {
  value: number;
  min: number;
  max: number;
  size: number;
  radius: number;
  arcWidth: number;
  angleOffset: number;
  angleRange: number;
  color: string;
  className?: string;
}

export const CustomArc: React.FC<CustomArcProps> = ({
  value,
  min,
  max,
  size,
  radius,
  arcWidth,
  angleOffset,
  angleRange,
  color,
  className,
}) => {
  const center = size / 2;
  const range = max - min;

  // Snap the value to the nearest multiple of 10
  const step = 10;
  const snappedValue = Math.round(value / step) * step;

  // Ensure snappedValue is within min and max bounds
  const clampedValue = Math.max(min, Math.min(max, snappedValue));

  // Map the snapped value to a percentage between 0 and 1
  const percentage = (clampedValue - min) / range; // 0 to 1
  const zeroPercentage = (0 - min) / range; // Percentage corresponding to value = 0

  // Calculate angles
  const startAngle = angleOffset + angleRange * zeroPercentage;
  const endAngle = angleOffset + angleRange * percentage;

  // Determine flags for arc drawing
  const deltaAngle = endAngle - startAngle;
  const largeArcFlag = Math.abs(deltaAngle) > 180 ? "1" : "0";
  const sweepFlag = deltaAngle >= 0 ? "1" : "0";

  // Calculate start and end coordinates
  const start = polarToCartesian(center, center, radius, startAngle);
  const end = polarToCartesian(center, center, radius, endAngle);

  // Create the arc path
  const d = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}
  `;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={arcWidth}
      strokeLinecap="round"
      className={className}
    />
  );
};

// Helper function to convert polar coordinates to Cartesian
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
