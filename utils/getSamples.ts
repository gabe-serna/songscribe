export default async function getSamples() {
  try {
    const wavResponse = await fetch("/audio/demo.mp3");
    const midiResponse = await fetch("/audio/demo.mid");

    if (!wavResponse.ok) {
      throw new Error(
        `Failed to fetch audio file: ${wavResponse.status} ${wavResponse.statusText}`,
      );
    } else if (!midiResponse.ok) {
      throw new Error(
        `Failed to fetch midi file: ${midiResponse.status} ${midiResponse.statusText}`,
      );
    }

    const audioblob = await wavResponse.blob();
    const midiblob = await midiResponse.blob();
    return { audioblob, midiblob };
  } catch (error) {
    console.error("Error fetching samples:", error);
    throw error;
  }
}
