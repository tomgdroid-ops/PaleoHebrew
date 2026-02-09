import { NextResponse } from "next/server";
import { getLetterMeanings } from "@/lib/data-loader";

export async function GET() {
  const letters = getLetterMeanings();
  return NextResponse.json(letters);
}
