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

const validMimeTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];

const formSchema = z.object({
  file: z
    .any()
    .refine(
      (fileList) =>
        fileList && fileList.length > 0 && fileList[0] instanceof File,
      { message: "Please upload a valid file." },
    )
    .refine(
      (fileList) => {
        const file = fileList[0];
        return validMimeTypes.includes(file.type);
      },
      {
        message: "Invalid file type. Only MP3, WAV, or OGG files are allowed.",
      },
    ),
});

export default function AudioToMidiForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fileList = values.file;
    const file = fileList[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/convert-to-midi", {
        method: "POST",
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
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Audio File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".mp3, .wav, .ogg"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload an MP3, WAV, or OGG file to convert to MIDI.
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
