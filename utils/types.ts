export interface AudioStorage {
  vocals: Stem;
  no_vocals: Stem;
  drums: Stem;
  guitar: Stem;
  bass: Stem;
  piano: Stem;
  others: Stem;
}

export interface AudioFormData {
  audio_file?: File;
  audio_link?: string;
  separation_mode?: SeparationMode;
  start_time?: number;
  end_time?: number;
  tempo?: number;
}

export interface midiAdjustments {
  onset_threshold: string;
  frame_threshold: string;
  minimum_note_length: string;
  minimum_frequency?: string;
  maximum_frequency?: string;
}

export interface Stem {
  name: Tracks;
  audioBlob: Blob;
  midiBlob: Blob | null;
}

export type Tracks =
  | "vocals"
  | "no_vocals"
  | "drums"
  | "guitar"
  | "bass"
  | "piano"
  | "others";

export type SeparationMode = "Solo" | "Duet" | "Small Band" | "Full Band";
