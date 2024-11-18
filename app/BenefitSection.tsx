"use client";
import BenefitCard from "@/components/BenefitCard";
import { useScreenSize } from "@/hooks/use-screen-size";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function BenefitSection() {
  const screenSize = useScreenSize();
  const isMobile =
    screenSize === "xs" || screenSize === "sm" || screenSize === "md";

  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const [focusedCard, setFocusedCard] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  // Handle component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const cardNumber = parseInt(entry.target.id.split("-")[1]);
        setFocusedCard(cardNumber);
      });
    };

    if (!observer) {
      const benefitObserver = new IntersectionObserver(callback, {
        threshold: 0.6,
      });
      setObserver(benefitObserver);

      benefitObserver.observe(document.getElementById("card-1") as Element);
      benefitObserver.observe(document.getElementById("card-2") as Element);
      benefitObserver.observe(document.getElementById("card-3") as Element);
      benefitObserver.observe(document.getElementById("card-4") as Element);
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  return (
    <section
      id="benefits"
      className="flex min-h-screen w-full max-w-[1000px] flex-shrink flex-row items-start justify-between bg-background lg:top-[-250vh] lg:flex-row xl:max-w-[1200px]"
    >
      <div id="benefit-cards" className="mt-8">
        <BenefitCard
          title="Effortless instrument isolation"
          subtitle="Listen with clarity"
          id="card-1"
        >
          Cut out the noise and work on one instrument at a time with our
          machine-learning powered instrument splitter. Hear only what you need,
          when you need it.
        </BenefitCard>
        {isMobile && (
          <div className="relative mx-auto mb-[5vh] aspect-square h-[35vh] overflow-hidden rounded-3xl bg-white shadow-lg dark:shadow-stone-950">
            <Image
              src="/videos/demo-1.gif"
              alt="Demo 1"
              fill
              className="size-full object-cover"
              unoptimized
              priority
            />
          </div>
        )}
        <BenefitCard
          title="Automatic MIDI transcription"
          subtitle="Capture every note"
          id="card-2"
        >
          Leave the tedious work behind. Convert each isolated audio track to
          MIDI for an instant transcription ready for you to shape and perfect.
        </BenefitCard>
        {isMobile && (
          <div className="relative mx-auto mb-[5vh] aspect-square h-[35vh] overflow-hidden rounded-3xl bg-white shadow-lg dark:shadow-stone-950">
            <Image
              src="/videos/demo-2.gif"
              alt="Demo 2"
              fill
              className="size-full object-cover"
              unoptimized
              priority
            />
          </div>
        )}
        <BenefitCard
          title="Customize and refine with ease"
          subtitle="Compose with precision"
          id="card-3"
        >
          Customize every aspect to perfectly match your vision. Fine-tune the
          MIDI output with five adjustable parameters, allowing you to shape
          each detail exactly as you want.
        </BenefitCard>
        {isMobile && (
          <div className="relative mx-auto mb-[5vh] aspect-square h-[35vh] overflow-hidden rounded-3xl bg-white shadow-lg dark:shadow-stone-950">
            <Image
              src="/videos/demo-3.gif"
              alt="Demo 3"
              fill
              className="size-full object-cover"
              unoptimized
              priority
            />
          </div>
        )}
        <BenefitCard
          title="Turn songs into sheet music"
          subtitle="Focus on what’s important"
          id="card-4"
        >
          Keep your focus on creating. Export your creation as sheet music
          that’s ready for further refinement in your favorite music notation
          editor, or download the isolated stems.
        </BenefitCard>
        {isMobile && (
          <div className="relative mx-auto mb-[5vh] aspect-square h-[35vh] overflow-hidden rounded-3xl bg-white shadow-lg dark:shadow-stone-950">
            <Image
              src="/videos/demo-4.gif"
              alt="Demo 4"
              fill
              className="size-full object-cover"
              unoptimized
              priority
            />
          </div>
        )}
      </div>
      {!isMobile && (
        <div id="benefit-video" className="sticky top-[20vh] mb-[30vh] mt-8">
          <div
            ref={videoRef}
            className="relative flex h-[350px] max-h-[800px] min-h-[100px] w-full items-center justify-center rounded-3xl bg-[hsl(50,10%,92%)] text-black shadow-xl [aspect-ratio:1_/_1] dark:bg-accent dark:shadow-stone-950 xl:h-[450px]"
          >
            {isMounted && (
              <Image
                key={focusedCard}
                src={`/videos/demo-${focusedCard}.gif`}
                alt={`Demo ${focusedCard}`}
                fill
                className="rounded-3xl object-cover"
                unoptimized
                priority
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
