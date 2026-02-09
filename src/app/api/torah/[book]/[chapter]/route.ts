import { NextResponse } from "next/server";
import { getChapter } from "@/lib/data-loader";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ book: string; chapter: string }> }
) {
  const { book, chapter: chapterStr } = await params;
  const chapter = parseInt(chapterStr, 10);

  if (isNaN(chapter)) {
    return NextResponse.json({ error: "Invalid chapter number" }, { status: 400 });
  }

  const data = getChapter(book.toLowerCase(), chapter);
  if (!data) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
