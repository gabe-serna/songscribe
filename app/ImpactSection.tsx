"use client";
import { useScreenSize } from "@/hooks/use-screen-size";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function ImpactSection() {
  const screenSize = useScreenSize();

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["end end", "center center"],
  });
  const { scrollYProgress: containerScrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      id="impact"
      className="relative z-30 flex h-[300vh] w-screen bg-[hsl(12,6%,15%)] dark:bg-[hsl(50,10%,92%)] sm:w-[calc(100vw-12px)]"
    >
      <div
        ref={contentRef}
        className="impact-shadow sticky top-[30vh] my-[30vh] flex h-[40vh] w-full items-center justify-center bg-secondary-foreground shadow-pink-800/50 dark:shadow-pink-600/50"
      >
        <motion.div
          style={{ opacity: scrollYProgress }}
          className="relative text-center *:text-3xl"
        >
          <h1 className="inline text-muted-foreground">Transcribing takes</h1>
          <motion.h1
            className="block text-muted-foreground max-sm:mt-1 sm:inline"
            ref={hoursRef}
            style={{
              opacity: useTransform(() => {
                const scrollPercentage = containerScrollY.get();

                if (scrollPercentage < 0.25) return 1;
                else {
                  const opacity = -4 * (1 + scrollPercentage) + 6;
                  // 0.25 -> opacity 1,    0.5 -> opacity 0

                  if (opacity <= 0) hoursRef.current!.style.display = "none";
                  else
                    hoursRef.current!.style.display =
                      screenSize != "xs" ? "inline" : "block";
                  return opacity;
                }
              }),
            }}
          >
            {" "}
            hours
          </motion.h1>
          <motion.h1
            ref={minutesRef}
            className="font-bold uppercase text-background max-sm:mt-1"
            style={{
              opacity: useTransform(() => {
                const scrollPercentage = containerScrollY.get();

                if (scrollPercentage < 0.5) {
                  if (minutesRef.current)
                    minutesRef.current!.style.display = "none";
                  return 0;
                } else {
                  const opacity = 1 - 4 * (1 - scrollPercentage) + 1;
                  // 0.5 -> opacity 0,     0.75 -> opacity 1

                  if (opacity <= 0) minutesRef.current!.style.display = "none";
                  else
                    minutesRef.current!.style.display =
                      screenSize != "xs" ? "inline" : "block";
                  return opacity;
                }
              }),
            }}
          >
            {" "}
            minutes
          </motion.h1>
          <motion.div
            className="absolute -right-5 h-2 w-20 rounded-[350%] bg-red-600 max-sm:left-0 max-sm:mx-auto sm:-right-3"
            style={{
              opacity: useTransform(() => {
                const scroll = containerScrollY.get();
                if (scroll < 0 || scroll > 0.5) {
                  return 0;
                }
                return (1 - Math.cos(4 * Math.PI * scroll)) / 2;
              }),
              width: useTransform(() => {
                const scrollPercentage = containerScrollY.get();
                if (scrollPercentage < 0.25) {
                  const width = 80 * (1 - 4 * (1 - scrollPercentage) + 3);
                  return width;
                } else if (scrollPercentage < 0.5) {
                  const width = 80 * (1 + 4 * (1 - scrollPercentage) - 3);
                  return width;
                } else return 0;
              }),
              transform: useTransform(() => {
                const scrollPercentage = containerScrollY.get();
                if (scrollPercentage < 0.25) {
                  // strike in
                  const percentage = 1 + 4 * (1 - scrollPercentage) - 4;
                  const multiplier = screenSize != "xs" ? 40 : 80;

                  const shiftX = multiplier * percentage;
                  const shiftY = 40 * percentage * 1.25 + 20;
                  return `translateX(${shiftX}px) rotate(-45deg) translateY(-${shiftY}px)`;
                } else if (scrollPercentage < 0.5) {
                  // strike out
                  const percentage = 1 - 4 * (1 - scrollPercentage) + 2;
                  const multiplier = screenSize != "xs" ? 90 : 50;

                  const shiftX = multiplier * percentage;
                  const shiftY =
                    percentage - 20 * (1 - percentage) + 15 * percentage;
                  return `translateX(-${shiftX}px) rotate(-45deg) translateY(${shiftY}px)`;
                } else
                  return "translateX(40px) rotate(-45deg) translateY(-20px)";
              }),
            }}
          />
        </motion.div>
        {/* Progress Indicator for Testing Purposes */}
        {/* <motion.div
          id="progress-indicator"
          style={{ scaleX: containerScrollY }}
          className="absolute bottom-0 h-5 w-full bg-transparent"
        /> */}
      </div>
    </section>
  );
}
