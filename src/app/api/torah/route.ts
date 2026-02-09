import { NextResponse } from "next/server";
import { getBooksMeta } from "@/lib/data-loader";

export async function GET() {
  const books = getBooksMeta();
  return NextResponse.json(books);
}
