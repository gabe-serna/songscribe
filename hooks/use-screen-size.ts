import { useState, useEffect } from "react";

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "";

export const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("xs");
      } else if (window.innerWidth >= 640 && window.innerWidth < 768) {
        setScreenSize("sm");
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setScreenSize("md");
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setScreenSize("lg");
      } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
        setScreenSize("xl");
      } else if (window.innerWidth >= 1536) {
        setScreenSize("2xl");
      } else {
        setScreenSize(""); // Fallback for unexpected cases
      }
    };

    // Add the resize event listener
    window.addEventListener("resize", handleResize);

    // Call the handler once to set the initial screen size
    handleResize();

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};
