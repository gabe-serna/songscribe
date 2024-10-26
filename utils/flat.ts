export async function createScore(midiFile: Blob, title: string) {
  const url = "https://api.flat.io/v2/scores";
  const base64Data = await blobToBase64(midiFile);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLAT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        filename: `${title}.mid`,
        privacy: "private",
        data: base64Data,
        dataEncoding: "base64",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create score: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();
    console.log("Score created successfully:", result);
    return result;
  } catch (error) {
    console.log("Error creating score:", error);
    return error;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      // Strip the "data:..." prefix, if you need only the base64 part
      resolve(base64data.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
