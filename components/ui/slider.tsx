"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none",
      // Orientation handling from the bug fix
      "data-[orientation='horizontal']:h-2 data-[orientation='horizontal']:w-full data-[orientation='horizontal']:items-center",
      "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-2 data-[orientation='vertical']:justify-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative grow overflow-hidden rounded-full bg-secondary",
        // Orientation handling from the bug fix
        "data-[orientation='horizontal']:h-2 data-[orientation='horizontal']:w-full",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-2",
        // Custom styles from your second component
        "bg-secondary",
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          // Custom Range styles from your second component
          "absolute h-full from-pink-300 to-pink-500 data-[orientation='horizontal']:bg-gradient-to-r data-[orientation='vertical']:bg-gradient-to-t dark:to-pink-400",
          "data-[orientation='horizontal']:h-full",
          "data-[orientation='vertical']:w-full",
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        // Custom Thumb styles from your second component
        "block h-5 w-5 rounded-full border-2 border-pink-500 dark:border-pink-400",
        "bg-background ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
