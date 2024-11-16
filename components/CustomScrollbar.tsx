"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomScrollbar() {
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [scrollbarTop, setScrollbarTop] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const updateScrollbar = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const scrollbarHeight = (windowHeight / documentHeight) * windowHeight;
      const scrollbarTop = (scrollTop / documentHeight) * windowHeight;

      setScrollbarHeight(scrollbarHeight);
      setScrollbarTop(scrollbarTop);

      setIsVisible(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    };

    window.addEventListener("scroll", updateScrollbar);
    window.addEventListener("resize", updateScrollbar);
    updateScrollbar();

    return () => {
      window.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`custom-scrollbar ${isVisible ? "visible" : ""}`}>
      <div
        className="custom-scrollbar-thumb"
        style={{
          height: `${scrollbarHeight}px`,
          transform: `translateY(${scrollbarTop}px)`,
        }}
      />
    </div>
  );
}
