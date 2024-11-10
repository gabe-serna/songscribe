import { forwardRef, useContext } from "react";
import { AudioContext } from "./AudioProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AudioStorage, Stem } from "@/utils/types";
import { Download } from "lucide-react";
import { zipAllParts } from "@/utils/zipAll";
import Embed from "flat-embed";

interface Props {
  embed: Embed | null;
}

const ExportView = forwardRef<HTMLDivElement, Props>(({ embed }, ref) => {
  const { audioStorage, songName } = useContext(AudioContext);
  // if (embed) {
  //   embed
  //     .getMusicXML()
  //     .then((xml) => console.log("xml", xml))
  //     .catch((err) => console.error(err));
  // } else {
  //   console.log("embed is null");
  // }

  return (
    <div className="flex w-full flex-col items-start justify-center max-xl:max-w-[800px] xl:flex-row xl:space-x-12">
      <div
        ref={ref}
        className="flex h-[400px] w-full max-w-[800px] items-center justify-center overflow-hidden rounded-2xl shadow-lg dark:shadow-stone-900 xl:h-[565.6px]"
      />
      <Accordion
        type="single"
        orientation="horizontal"
        className="flex w-full flex-col justify-between max-xl:ml-0 max-xl:mt-8 xl:h-[565.6px] xl:max-w-[300px]"
        collapsible
      >
        <div
          className={`flex flex-col justify-normal space-y-4 xl:justify-between`}
        >
          <AccordionItem value="export" className="rounded-3xl shadow-md">
            <AccordionTrigger className="font-heading w-max rounded-3xl border-2 border-border bg-accent px-6 data-[state=open]:rounded-b-none xl:max-w-[300px]">
              Export
            </AccordionTrigger>
            <AccordionContent className="rounded-b-3xl border-2 border-t-0 border-border bg-stone-200 px-6 dark:bg-popover">
              <ol>
                <span className="mb-2 flex items-center justify-between space-x-4">
                  <li>Print</li>
                  <Download
                    className="cursor-pointer stroke-pink-500 transition-colors hover:stroke-pink-700 dark:stroke-pink-600 dark:hover:stroke-pink-800"
                    onClick={() => {
                      console.log("Print Button Clicked");
                      // this shit isn't working wtf
                    }}
                  />
                </span>
                <li>Midi</li>
                <li>MusicXML</li>
                <br />
                <span className="mb-2 flex items-center justify-between space-x-4">
                  <li>Midi and Audio for All Parts</li>
                  <Download
                    className="cursor-pointer stroke-pink-500 transition-colors hover:stroke-pink-700 dark:stroke-pink-600 dark:hover:stroke-pink-800"
                    onClick={() => zipAllParts(audioStorage!, songName.current)}
                  />
                </span>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="midi-files" className="rounded-3xl shadow-md">
            <AccordionTrigger className="font-heading w-full rounded-3xl border-2 border-border bg-accent px-6 data-[state=open]:rounded-b-none">
              Midi Files
            </AccordionTrigger>
            <AccordionContent className="rounded-b-3xl border-2 border-t-0 border-border bg-stone-200 px-6 dark:bg-popover">
              <ol>
                {Object.entries(
                  audioStorage as Record<keyof AudioStorage, Stem>,
                ).map(([key, stem]) => {
                  if (!stem.midiBlob) return;
                  return (
                    <span
                      key="key"
                      className="mb-2 flex items-center justify-between space-x-4"
                    >
                      <li>{`${key.charAt(0).toUpperCase()}${key.substring(1)}`}</li>
                      <Download
                        className="cursor-pointer stroke-pink-500 transition-colors hover:stroke-pink-700 dark:stroke-pink-600 dark:hover:stroke-pink-800"
                        onClick={() => {
                          const url = URL.createObjectURL(stem.midiBlob!);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${stem.name}.mid`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      />
                    </span>
                  );
                })}
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="audio-files" className="rounded-3xl shadow-md">
            <AccordionTrigger className="font-heading w-max rounded-3xl border-2 border-border bg-accent px-6 data-[state=open]:rounded-b-none xl:max-w-[300px]">
              Audio Files
            </AccordionTrigger>
            <AccordionContent className="rounded-b-3xl border-2 border-t-0 border-border bg-stone-200 px-6 dark:bg-popover">
              <ol>
                {Object.entries(
                  audioStorage as Record<keyof AudioStorage, Stem>,
                ).map(([key, stem]) => {
                  if (!stem.audioBlob) return;
                  return (
                    <span
                      key="key"
                      className="mb-2 flex items-center justify-between space-x-4"
                    >
                      <li>{`${key.charAt(0).toUpperCase()}${key.substring(1)}`}</li>
                      <Download
                        className="cursor-pointer stroke-pink-500 transition-colors hover:stroke-pink-700 dark:stroke-pink-600 dark:hover:stroke-pink-800"
                        onClick={() => {
                          const url = URL.createObjectURL(stem.audioBlob!);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${stem.name}.mp3`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      />
                    </span>
                  );
                })}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>
    </div>
  );
});

export default ExportView;
