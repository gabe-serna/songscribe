"use server";

export async function clearScores(baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/api/cron`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to clear scores: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error clearing scores:", error);
    return false;
  }
}
