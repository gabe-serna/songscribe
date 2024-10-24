"use client";

import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Waveform from "@/components/Waveform";
import JSZip from "jszip";

const validMimeTypes = ["audio/mpeg", "audio/wav", "audio/ogg, audio/flac"];
const apiBaseUrl = "http://localhost:8000";

const formSchema = z.object({
  audio_file: z
    .any()
    .refine((fileList) => fileList && fileList.length > 0, {
      message: "Please upload a valid file.",
    })
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return false;
        const file = fileList[0];
        return validMimeTypes.includes(file.type);
      },
      {
        message:
          "Invalid file type. Only MP3, WAV, OGG, or FLAC files are allowed.",
      },
    ),
  separation_mode: z.enum(["solo", "duet", "small_band", "full_band"]),
});

type Tracks = "vocals" | "drums" | "guitar" | "bass" | "piano" | "others";

interface Stem {
  name: Tracks;
  audioBlob: Blob;
  midiBlob: Blob | null;
}

interface AudioStorage {
  vocals: Stem;
  drums: Stem;
  guitar: Stem;
  bass: Stem;
  piano: Stem;
  others: Stem;
}

export default function AudioToMidiForm() {
  const [audioStorage, setAudioStorage] = useState<AudioStorage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastRun = useRef(Date.now());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audio_file: null,
      separation_mode: "solo",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fileList = values.audio_file;
    const file = fileList[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("audio_file", file);

    let separation_mode: String;
    switch (values.separation_mode) {
      case "duet":
        separation_mode = "Vocals & Instrumental (High Quality, Slower)";
        break;
      case "small_band":
        separation_mode = "Vocals, Drums, Bass & Other (Slower)";
        break;
      case "full_band":
        separation_mode = "Vocal, Drums, Bass, Guitar, Piano & Other (Slowest)";
        break;
      case "solo":
      default:
        separation_mode = "Vocals & Instrumental (Low Quality, Faster)";
    }
    formData.append("separation_mode", separation_mode as string);
    formData.append("end_time", `${10}`);

    try {
      setIsSubmitting(true);
      const response = await fetch(`${apiBaseUrl}/split-audio`, {
        method: "POST",
        mode: "cors",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to isolate audio");
      }

      JSZip.loadAsync(response.blob()).then((zip) => {
        zip.forEach((relativePath, file) => {
          file.async("blob").then((blob) => {
            const name = relativePath.split(".")[0];
            setAudioStorage(
              (prev) =>
                ({
                  ...prev,
                  [name]: { name, audioBlob: blob, midiBlob: null },
                }) as AudioStorage,
            );
          });
        });
      });
      console.log("Audio isolated successfully");
    } catch (error) {
      console.error(error);
      alert("Error converting isolating audio");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Convert to Midi
  useEffect(() => {
    async function convertToMidi(stem: Stem): Promise<Blob> {
      const formData = new FormData();
      formData.append("audio_file", stem.audioBlob);

      const response = await fetch(`${apiBaseUrl}/audio-to-midi`, {
        method: "POST",
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        console.error("Failed to convert audio");
        console.error(response.body);
      }
      const midiBlob = await response.blob();
      return midiBlob;
    }

    async function handleMidiConversion() {
      if (!audioStorage) return;
      const needsMidi: Stem[] = [];

      Object.keys(audioStorage as AudioStorage).forEach((value) => {
        const stem = audioStorage[value as Tracks];
        if (!stem.audioBlob) return;
        if (stem.midiBlob) return;
        needsMidi.push(stem);
      });

      if (needsMidi.length === 0) return;
      console.log("Converting to MIDI", needsMidi);

      const needMidiSingle = needsMidi.shift();
      // Run all the conversions in parallel and wait for them to complete
      // const midiResults = await Promise.all(
      //   needsMidi.map((stem, i) =>
      //     convertToMidi(stem).then((midiBlob) => {
      //       const name = names[i] as Tracks;
      //       return { name, midiBlob };
      //     }),
      //   ),
      // );
      const midiResults = await convertToMidi(needMidiSingle!).then(
        (midiBlob) => {
          return {
            name: needMidiSingle?.name,
            midiBlob,
            audioBlob: needMidiSingle?.audioBlob,
          };
        },
      );

      setAudioStorage((prev) => {
        if (!prev) return prev;
        const updatedStorage: AudioStorage = { ...prev };
        const name = needMidiSingle?.name as Tracks;
        updatedStorage[name] = {
          ...updatedStorage[name],
          midiBlob: midiResults.midiBlob,
        };
        // midiResults.forEach(({ name, midiBlob }) => {
        //   updatedStorage[name] = {
        //     ...updatedStorage[name],
        //     midiBlob,
        //   };
        // });

        return updatedStorage;
      });
    }

    if (!audioStorage) return;

    // Temporarily throttle the conversion to once per second
    if (Date.now() - lastRun.current < 1000) return;
    lastRun.current = Date.now();

    handleMidiConversion();
  }, [audioStorage]);

  return (
    <div className="flex w-full flex-col justify-around">
      {!audioStorage && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="audio_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Audio File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".mp3, .wav, .ogg, .flac"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an audio file to convert to MIDI.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="separation_mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Separation Mode</FormLabel>
                  <FormControl>
                    <select
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      className="w-full"
                    >
                      <option value="solo">Solo</option>
                      <option value="duet">Duet</option>
                      <option value="small_band">Small Band</option>
                      <option value="full_band">Full Band</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Select the separation mode for the audio file.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Converting..." : "Submit"}
            </Button>
          </form>
        </Form>
      )}
      {audioStorage &&
        Object.entries(audioStorage as Record<keyof AudioStorage, Stem>).map(
          ([key, stem]) => {
            if (!stem.midiBlob) return;
            console.log("audioStorage: ", audioStorage);
            return (
              <Waveform
                key={key}
                audioBlob={stem.audioBlob}
                midiFile={stem.midiBlob}
              />
            );
          },
        )}
    </div>
  );
}
