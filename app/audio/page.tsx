"use client";

import React, { useState } from "react";
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
});

export default function AudioToMidiForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audio_file: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fileList = values.audio_file;
    const file = fileList[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("audio_file", file);

    try {
      setIsSubmitting(true);
      const response = await fetch(`${apiBaseUrl}/audio-to-midi`, {
        method: "POST",
        mode: "cors",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert audio");
      }

      const midiBlob = await response.blob();
      const midiUrl = URL.createObjectURL(midiBlob);

      // Trigger the download of the MIDI file
      const link = document.createElement("a");
      link.href = midiUrl;
      link.download = "converted.mid"; // Specify the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optionally revoke the object URL after download
      URL.revokeObjectURL(midiUrl);
    } catch (error) {
      console.error(error);
      alert("Error converting audio to MIDI");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full justify-around">
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Converting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
