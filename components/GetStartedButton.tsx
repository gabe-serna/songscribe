"use client";
import { Button } from "./ui/button";

interface GetStartedButtonProps {
  reverseTheme?: boolean;
}

export default function GetStartedButton({
  reverseTheme = false,
}: GetStartedButtonProps) {
  return (
    <Button
      onClick={() => (window.location.href = "/audio")}
      className={`mt-8 w-min rounded-full px-12 text-base shadow-lg xl:mt-12 xl:px-20 ${
        reverseTheme
          ? "border-t-[3px] border-[#f5bc52cc] bg-yellow-600 font-semibold text-foreground shadow-lg shadow-stone-900 hover:bg-[#dd9700] dark:border-[#fef08bcc] dark:bg-yellow-400 dark:text-background dark:shadow-[rgb(0_0_0_/_0.1)] dark:hover:bg-[#ffd52e]"
          : "button-action"
      }`}
    >
      Get Started
    </Button>
  );
}
