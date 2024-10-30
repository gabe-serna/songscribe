"use client";
import JSZip from "jszip";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import getTempo from "@/utils/getTempo";
import { useContext, useState } from "react";
import { AudioContext } from "./AudioProvider";
import { AudioStorage } from "@/utils/types";

const validMimeTypes = ["audio/mpeg", "audio/wav", "audio/ogg, audio/flac"];
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

export default function AudioForm() {
  const { audioStorage, setAudioStorage, songName, tempo } =
    useContext(AudioContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = "http://localhost:8000";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audio_file: null,
      separation_mode: "solo",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fileList = values.audio_file;
    const file = fileList[0] as File;
    if (!file) return;

    const bpm = await getTempo(file);
    tempo.current = Math.round(bpm);
    songName.current = file.name.split(".")[0];
    console.log("tempo: ", tempo.current);

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
    formData.append("tempo", `${tempo.current}`);
    formData.append("start_time", `${28}`);
    formData.append("end_time", `${71}`);

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

  return (
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
  );
}