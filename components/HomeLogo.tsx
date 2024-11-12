"use client";

import { useTheme } from "next-themes";

export default function HomeLogo() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <img
      src={isDark ? "/logo-dark.png" : "/logo-light.png"}
      alt="logo"
      className="mt-8 h-auto w-[200px] sm:w-[300px] lg:mt-0 xl:w-[400px]"
    />
  );
}
