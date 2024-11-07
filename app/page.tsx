"use client";
import { Arc, Knob, Pointer, Value } from "rc-knob";

export default async function Index() {
  return (
    <>
      <main className="flex flex-1 flex-col gap-6 px-4">
        <h1 className="mb-4 text-xl font-semibold">Songscribe</h1>
        <p>The fastest way to turn any song into sheet music</p>
        <Knob
          size={100}
          angleOffset={220}
          angleRange={280}
          steps={10}
          snap={true}
          min={0}
          max={100}
          // onChange={(value) => console.log(value)}
        >
          <Arc arcWidth={5} color="#FC5A96" radius={47.5} />
          <Pointer width={5} radius={40} type="circle" color="#FC5A96" />
          <Value marginBottom={40} className="value" />
        </Knob>
      </main>
    </>
  );
}
