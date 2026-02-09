import { NextResponse } from "next/server";
import { getVerse } from "@/lib/data-loader";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ book: string; chapter: string; verse: string }> }
) {
  const { book, chapter: chapterStr, verse: verseStr } = await params;
  const chapter = parseInt(chapterStr, 10);
  const verse = parseInt(verseStr, 10);

  if (isNaN(chapter) || isNaN(verse)) {
    return NextResponse.json({ error: "Invalid chapter or verse number" }, { status: 400 });
  }

  const data = getVerse(book.toLowerCase(), chapter, verse);
  if (!data) {
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
