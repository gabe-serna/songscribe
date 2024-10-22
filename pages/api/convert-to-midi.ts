import type { NextApiRequest, NextApiResponse } from "next";
import {
  BasicPitch,
  noteFramesToTime,
  outputToNotesPoly,
  addPitchBendsToNoteEvents,
  NoteEventTime,
} from "@spotify/basic-pitch";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import audioDecode from "audio-decode";
import { Midi } from "@tonejs/midi";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing to handle file uploads
  },
};

const validMimeTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  process.env.TF_CPP_MIN_LOG_LEVEL = "2"; // Suppress TensorFlow.js warnings

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  let uploadedFile: formidable.File | null = null;

  try {
    const { fields, files } = await parseForm(req);

    if (!files.file) {
      res.status(400).send("No file uploaded");
      return;
    }

    // Handle the case where files.file may be an array
    const file = files.file;
    if (Array.isArray(file)) {
      uploadedFile = file[0];
    } else {
      uploadedFile = file;
    }

    if (!uploadedFile) {
      res.status(400).send("No file uploaded");
      return;
    }

    // Validate file type
    if (!validMimeTypes.includes(uploadedFile.mimetype || "")) {
      res
        .status(400)
        .send("Invalid file type. Only MP3, WAV, or OGG files are allowed.");
      return;
    }

    // Read the uploaded file into a buffer
    const audioData = fs.readFileSync(uploadedFile.filepath);

    // Decode audio data to get audio samples
    const audioBuffer = await audioDecode(audioData);

    // Dynamically import '@tensorflow/tfjs-node' before using BasicPitch
    const tf = await import("@tensorflow/tfjs-node");

    // Initialize BasicPitch with the model path
    const modelPath = path.resolve(
      "node_modules/@spotify/basic-pitch/model/model.json",
    );
    console.log("modelPath", modelPath);
    const basicPitch = new BasicPitch(modelPath);

    const frames: number[][] = [];
    const onsets: number[][] = [];
    const contours: number[][] = [];

    // Evaluate the model on the audio data
    await basicPitch.evaluateModel(
      audioBuffer.getChannelData(0),
      (f: number[][], o: number[][], c: number[][]) => {
        frames.push(...f);
        onsets.push(...o);
        contours.push(...c);
      },
      (progress: number) => {
        // Handle progress updates if needed
      },
    );

    // Convert model outputs to MIDI notes
    const notes = noteFramesToTime(
      addPitchBendsToNoteEvents(
        contours,
        outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
      ),
    );

    // Generate MIDI file using Tone.js MIDI library
    const midi = new Midi();
    const track = midi.addTrack();
    notes.forEach((note: NoteEventTime) => {
      track.addNote({
        midi: note.pitchMidi,
        time: note.startTimeSeconds,
        duration: note.durationSeconds,
        velocity: note.amplitude,
      });
      if (note.pitchBends) {
        note.pitchBends.forEach((bend, index) => {
          if (note.pitchBends) {
            track.addPitchBend({
              time:
                note.startTimeSeconds +
                (note.durationSeconds * index) / note.pitchBends.length,
              value: bend,
            });
          }
        });
      }
    });

    // Convert the MIDI data to a Buffer
    const midiBuffer = Buffer.from(midi.toArray());

    // Set response headers for file download
    res.setHeader("Content-Type", "audio/midi");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="converted.mid"',
    );

    // Send the MIDI file as a response
    res.status(200).send(midiBuffer);
  } catch (error) {
    console.error("Error processing audio file:", error);
    res.status(500).send("Error processing audio file");
  } finally {
    // Clean up the temporary file
    if (uploadedFile && uploadedFile.filepath) {
      console.log("Deleting temporary file:", uploadedFile.filepath);
      fs.unlink(uploadedFile.filepath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    } else {
      console.warn("No temporary file to delete.");
    }
  }
}

// Helper function to parse the incoming form data
function parseForm(
  req: NextApiRequest,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50 MB
      multiples: false, // Ensure only single file uploads are allowed
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
