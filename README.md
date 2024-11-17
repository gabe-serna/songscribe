<a href="https://songscribe.xyz">
<p align="center">
  <img alt="songscribe logo" src="https://i.ibb.co/QnxT7zp/songscribe-banner.png" width="500">
</p>
</a>

<h3 align="center">
  <i>The fastest way to turn any song into sheet music.</i>
</h3>

<hr>
<br>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ♫
  <a href="#why"><strong>Why?</strong></a> ♫
  <a href="#quick-start"><strong>Quick Start</strong></a> ♫
  <a href="#technologies-used"><strong>Technologies Used</strong></a> ♫
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
</p>
<br/>

## Features

> This is Songscribe! A web application for musicians to jumpstart the process of transcribing music. Within minutes, you'll have the perfect starting point for a complete transcription of a song.

- Upload a song with an audio file or YouTube URL
- Machine-learning powered instrument splitter / vocal remover
  - Choose between 4 presets: Solo, Duet, Small Band, and Full Band
- Convert audio to MIDI for automatic transcription
- Customize the MIDI transcription with many parameters
- Integrated audio and MIDI playback and visualization
- Generate sheet music for final score with playback
- Export isolated stems and MIDI files
- Print or export sheet music as PDF

<br/>

## Why?

As a musician, I've always loved being able to hear something interesting in a song, transcribe it, and understand what it is so that I can use it in my own playing or compositions. Cracking that elusive code behind what makes something sound good is always so satisfying.

_Well… minus the part where I loop 2 seconds of the YouTube recording at 0.5x speed for an hour to figure out what one chord is._

That's why I made **Songscribe**, a tool for jumpstarting the transcription process. By utilizing machine-learning algorithms to isolate each instrument and convert it to MIDI, you will have an incredible starting point for transcribing _every part_ of a song in minutes. Not hours—**minutes**.

<br/>

## Quick Start

You can get started transcribing with Songscribe by visiting **[songscribe.xyz](https://songscribe.xyz)**.

Here's a quick overview of how to use Songscribe:

- Upload the song you want to transcribe
  - File Upload
  - YouTube Link
- Choose the preset that best suits the song you're transcribing
  - **Solo**- (1 instrument)
  - **Duet**- (vocals, no vocals)
  - **Small Band**- (vocals, drums, bass, and other instruments)
  - **Full Band**- (vocals, drums, bass, guitar, piano, and other instruments)
- Optionally, select the tempo and the start time and end time of the song to be transcribed
- Click the **Transcribe** button
- Adjust the MIDI parameters to regenerate the transcription for each instrument to your liking
- Click the **Export** button to create the final score and download all files generated from the session

<br/>

## Technologies Used

Here is a quick breakdown of all the main technologies used to create Songscribe.

**[Frontend](https://github.com/gabe-serna/songscribe)**:

- React
- Next.js
- TailwindCSS
- shadcn/ui
- Libraries:
  - **[Tone.js](https://github.com/Tonejs/Tone.js)**- MIDI playblack and visualization
  - **[wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)**- Waveform Visualization
  - **[Flat Embed](https://github.com/FlatIO/embed-client)**- Embedded sheet music viewer

**[Backend](https://github.com/gabe-serna/songscribe-api)**:

- Python
- Libraries:
  - **[Moseca](https://github.com/fabiogra/moseca)**- Instrument separation
  - **[Basic Pitch](https://github.com/spotify/basic-pitch)**- Audio to MIDI conversion
  - **[ADTOF](https://github.com/MZehren/ADTOF)**- Drum transcription

<br/>

## Feedback and issues

Please file feedback and issues over on [Github Issues](https://github.com/gabe-serna/songscribe/issues/new). All feedback is welcome!
