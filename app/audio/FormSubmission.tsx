"use client";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import isolateAudio from "@/utils/isolateAudio";

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
  separation_mode: z.enum(["Solo", "Duet", "Small Band", "Full Band"]),
  start_time: z.number().int().min(0).optional(),
  end_time: z.number().int().min(0).optional(),
  tempo: z.number().int().min(0).optional(),
});

export default function AudioForm() {
  const { setAudioStorage, songName, tempo } = useContext(AudioContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audio_file: null,
      separation_mode: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fileList = values.audio_file;
    const file = fileList[0] as File;
    if (!file) return;

    setIsSubmitting(true);
    songName.current = file.name.split(".")[0];

    // Set Tempo
    if (!values.tempo) {
      tempo.current = await getTempo(file);
    } else tempo.current = values.tempo;
    console.log("tempo: ", tempo.current);

    // Create Form Data
    const formData = new FormData();
    formData.append("audio_file", file);
    formData.append("separation_mode", values.separation_mode);
    formData.append("tempo", `${tempo.current}`);
    if (values.start_time)
      formData.append("start_time", `${values.start_time}`);
    if (values.end_time) formData.append("end_time", `${values.end_time}`);

    // Make API Request
    isolateAudio(formData, setAudioStorage).then(() => {
      setIsSubmitting(false);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
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
                  defaultValue=""
                >
                  <option value="" hidden disabled></option>
                  <option value="Solo">Solo</option>
                  <option value="Duet">Duet</option>
                  <option value="Small Band">Small Band</option>
                  <option value="Full Band">Full Band</option>
                </select>
              </FormControl>
              <FormDescription>
                Select the separation mode for the audio file.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Optional</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        required={false}
                        aria-required={false}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value),
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Audio start time in seconds.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        required={false}
                        aria-required={false}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value),
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Audio end time in seconds.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tempo"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Tempo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        required={false}
                        aria-required={false}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value),
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Song tempo in beats per minute.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Converting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
