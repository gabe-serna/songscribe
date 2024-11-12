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

You can get started with Songscribe by visiting [songscribe.xyz](https://songscribe.xyz).

> <p>Currently, the API backend powering the audio isolation and audio to MIDI conversion is not hosted anywhere (<i>the machine learning models are a bit too intensive for free hosting solutions</i>). <br><br> <strong>This means you will have to run the API locally.</strong> Extensive documentation on how to do so have been provided for you <a href="https://github.com/gabe-serna/songscribe-api?tab=readme-ov-file#songscribe-api">here</a> for this reason.</p>

<br/>

## Technologies Used

Here is a quick breakdown of all the main technologies used to create Songscribe.

Frontend:

- React
- Next.js
- TailwindCSS
- shadcn/ui
- Libraries:
  - **[Tone.js](https://github.com/Tonejs/Tone.js)**- MIDI playblack and visualization
  - **[wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)**- Waveform Visualization
  - **[Flat Embed](https://github.com/FlatIO/embed-client)**- Embedded sheet music viewer

Backend:

- Python
- Libraries:
  - **[Moseca](https://github.com/fabiogra/moseca)**- Instrument separation
  - **[Spotify Basic Pitch](https://github.com/spotify/basic-pitch)**- Audio to MIDI conversion

<br/>

## Feedback and issues

Please file feedback and issues over on [Github Issues](https://github.com/gabe-serna/songscribe/issues/new).
