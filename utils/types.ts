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