export async function createScore(midiFile: Blob, title: string) {
  const url = "https://api.flat.io/v2/scores";
  const base64Data = await blobToBase64(midiFile);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLAT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      filename: `${title}.mid`,
      privacy: "public",
      data: base64Data,
      dataEncoding: "base64",
    }),
  }).catch((error) => {
    if (error.message.includes("402")) {
      throw new Error("402");
    } else throw new Error("0");
  });

  if (response) {
    if (!response.ok && response.status === 402) {
      throw new Error("402");
    }
  } else throw new Error("0");

  const result = await response.json();
  return result;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
