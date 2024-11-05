"use client";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { AudioContext } from "@/app/audio/AudioProvider";

export default function AudioPart1() {
  const { setAudioForm } = useContext(AudioContext);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      setAudioForm({ audio_file: file });
    } else if (link) {
      setAudioForm({ audio_link: link });
    }
  }, [file, link]);

  function handleSongLinkSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const songLink = formData.get("song-link") as string;

    if (isValidYouTubeUrl(songLink)) {
      setLink(songLink);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Invalid URL!",
        description: "Please input a valid YouTube URL.",
      });
    }
  }

  return (
    <div className="w-full max-w-[500px] rounded-2xl bg-accent p-6 shadow-lg dark:shadow-stone-900 lg:w-3/4 lg:p-8">
      <form onSubmit={handleSongLinkSubmit}>
        <Label
          htmlFor="song-link"
          className="font-heading mx-auto block w-max text-base font-semibold"
        >
          Upload a song link
        </Label>
        <Input
          id="song-link"
          name="song-link"
          type="text"
          placeholder="https://youtu.be/dQw4w9WgXcQ"
          className="mt-2"
        ></Input>
      </form>
      <span className="font-heading mx-auto mt-4 block w-max font-semibold">
        OR
      </span>
      <FileUpload setFile={setFile} />
    </div>
  );
}

function isValidYouTubeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.replace("www.", "");

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      return url.pathname === "/watch" && url.searchParams.has("v");
    } else if (hostname === "youtu.be") {
      return url.pathname.length > 1;
    }
    return false;
  } catch (e) {
    // Invalid URL
    return false;
  }
}
