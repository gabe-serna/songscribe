export type Tracks =
  | "vocals"
  | "no_vocals"
  | "drums"
  | "guitar"
  | "bass"
  | "piano"
  | "others";

export interface Stem {
  name: Tracks;
  audioBlob: Blob;
  midiBlob: Blob | null;
}

export interface AudioStorage {
  vocals: Stem;
  no_vocals: Stem;
  drums: Stem;
  guitar: Stem;
  bass: Stem;
  piano: Stem;
  others: Stem;
}

export type SeparationMode = "Solo" | "Duet" | "Small Band" | "Full Band";

export interface AudioFormData {
  audio_file?: File;
  audio_link?: string;
  separation_mode?: SeparationMode;
  start_time?: number;
  end_time?: number;
  tempo?: number;
}
