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
      className={`fixed top-0 z-50 w-full border-b border-b-foreground/10 bg-background/80 px-9 backdrop-blur-sm transition-all duration-300 sm:px-[6.25rem] xl:px-[7.25rem] ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1000px] items-center justify-between p-0 sm:px-6 xl:max-w-[1200px] xl:p-8">
        <Link href="/" className="text-xl font-bold">
          Songscribe
        </Link>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
