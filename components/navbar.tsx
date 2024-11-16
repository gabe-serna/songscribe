"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeSwitcher } from "./theme-switcher";

export function Navbar() {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [prevOffset, setPrevOffset] = useState(0);

  useEffect(() => {
    const toggleScrollDirection = () => {
      const scrollY = window.scrollY;
      if (scrollY === 0) {
        setScrollDirection("up");
      } else if (scrollY > prevOffset) {
        setScrollDirection("down");
      } else if (scrollY < prevOffset) {
        setScrollDirection("up");
      }
      setPrevOffset(scrollY);
    };

    window.addEventListener("scroll", toggleScrollDirection);
    return () => window.removeEventListener("scroll", toggleScrollDirection);
  }, [prevOffset]);

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b border-b-foreground/10 bg-background/80 px-5 backdrop-blur-sm transition-transform duration-300 lg:w-[calc(100vw-12px)] ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-5 sm:px-[6.5rem] sm:pr-[5rem] xl:px-[8rem] xl:pr-[6rem]">
        <Link href="/" className="text-xl font-bold">
          Songscribe
        </Link>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
