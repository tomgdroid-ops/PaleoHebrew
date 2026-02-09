import { NextResponse } from "next/server";
import { getLetterMeanings } from "@/lib/data-loader";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ letter: string }> }
) {
  const { letter } = await params;
  const decodedLetter = decodeURIComponent(letter);
  const letters = getLetterMeanings();
  const found = letters.find((l) => l.letter === decodedLetter || l.name.toLowerCase() === decodedLetter.toLowerCase());

  if (!found) {
    return NextResponse.json({ error: "Letter not found" }, { status: 404 });
  }

  return NextResponse.json(found);
}
