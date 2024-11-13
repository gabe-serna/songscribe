import React from "react";

export default function HomeLogo() {
  return (
    <div className="mt-8 h-auto w-[200px] sm:w-[300px] lg:mt-0 xl:w-[400px]">
      <img
        src="/logo-light.png"
        alt="Songscribe Logo - Light Mode"
        className="block h-auto w-full dark:hidden"
      />
      <img
        src="/logo-dark.png"
        alt="Songscribe Logo - Dark Mode"
        className="hidden h-auto w-full dark:block"
      />
    </div>
  );
}
