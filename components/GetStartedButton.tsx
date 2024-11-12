"use client";
import { Button } from "./ui/button";

export default function GetStartedButton() {
  return (
    <Button
      onClick={() => (window.location.href = "/audio")}
      className="button-primary mt-8 w-min rounded-full px-12 text-base xl:mt-12 xl:px-20"
    >
      Get Started
    </Button>
  );
}
