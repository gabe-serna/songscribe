import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all scores
    const getScoresUrl = `https://api.flat.io/v2/collections/app/scores`;
    const response = await fetch(getScoresUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLAT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to get scores:", await response.json());
      return NextResponse.json(
        { error: "Failed to get scores" },
        { status: 500 },
      );
    }

    const scores = await response.json();

    // Check if there are any scores to delete
    if (!scores || scores.length === 0) {
      return NextResponse.json({ ok: true, message: "No scores to delete" });
    }

    // Delete each score
    for (const score of scores) {
      const deleteScoreUrl = `https://api.flat.io/v2/scores/${score.id}`;

      try {
        const deleteResponse = await fetch(deleteScoreUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLAT_API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (!deleteResponse.ok) {
          console.error(
            `Failed to delete score ${score.id}:`,
            await deleteResponse.text(),
          );
        } else {
          console.log(`Successfully deleted score: ${score.id}`);
        }
      } catch (deleteError) {
        console.error(`Error deleting score ${score.id}:`, deleteError);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Scores deleted successfully",
    });
  } catch (error) {
    console.error("Error fetching or deleting scores:", error);
    return NextResponse.json(
      { error: "An error occurred while processing scores" },
      { status: 500 },
    );
  }
}
