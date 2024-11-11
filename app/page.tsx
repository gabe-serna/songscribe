"use client";
import { Button } from "@/components/ui/button";

export default async function Index() {
  return (
    <>
      <main className="flex flex-1 flex-col justify-center px-4">
        <h1 className="text-xl font-semibold">Songscribe</h1>
        <p className="mt-2">
          The fastest way to turn any song into sheet music
        </p>
        <Button
          onClick={() => (window.location.href = "/audio")}
          className="button-primary mt-8"
        >
          Get Started
        </Button>
      </main>
    </>
  );
}
