"use client";
import { useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface Props {
  setFile: (file: File | null) => void;
}

export default function FileUpload({ setFile }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBrowseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFile(files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
      className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-[4px] border-dashed border-border bg-input px-5 py-12"
    >
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".mp3, .wav, .ogg, .flac"
        className="hidden"
      />
      <Image
        src="/cloud-upload-icon.webp"
        alt="cloud upload"
        width={64}
        height={64}
        className="size-16 dark:opacity-30 dark:saturate-200"
      />
      <p className="select-none text-sm text-muted-foreground lg:text-base">
        Drag files here or{" "}
        <span className="cursor-pointer font-semibold text-yellow-600 dark:text-yellow-700">
          browse
        </span>
      </p>
    </div>
  );
}
