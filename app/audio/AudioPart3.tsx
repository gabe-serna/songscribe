"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useContext } from "react";
import { AudioContext } from "@/app/audio/AudioProvider";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  start_time: z.number().int().min(0).optional(),
  end_time: z.number().int().min(0).optional(),
  tempo: z.number().int().min(0).optional(),
});

export default function AudioPart3({
  setIsSubmitting,
}: {
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
}) {
  const { audioForm, setAudioForm } = useContext(AudioContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const tempo = values.tempo;
    const start_time = values.start_time;
    const end_time = values.end_time;

    setAudioForm({ ...audioForm, tempo, start_time, end_time });
    setIsSubmitting(true);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 flex w-full flex-col items-center justify-center space-y-8"
      >
        <div className="w-full max-w-[500px] rounded-2xl bg-accent p-6 shadow-lg dark:shadow-stone-900 lg:w-3/4 lg:p-8">
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
                <FormDescription>Audio start time in seconds.</FormDescription>
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
                <FormDescription>Audio end time in seconds.</FormDescription>
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
        </div>
        <Button
          type="submit"
          className="mt-4 w-full rounded-full bg-yellow-400 text-base font-semibold text-foreground shadow-lg hover:bg-yellow-400 dark:bg-yellow-600 dark:text-background dark:shadow-stone-900 dark:hover:bg-yellow-600 lg:w-3/4"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}