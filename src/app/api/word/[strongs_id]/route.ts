import { NextResponse } from "next/server";
import { getLetterMeanings, getStrongsEntry, getCuratedSentences } from "@/lib/data-loader";
import { splitToLetters, toPaleoHebrew, toConsonantal } from "@/lib/hebrew";
import { generateInterpretations, getLetterDetails } from "@/lib/sentence-engine";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ strongs_id: string }> }
) {
  const { strongs_id } = await params;

  // Normalize the Strong's ID
  let id = strongs_id.toUpperCase();
  if (!id.startsWith("H")) {
    id = `H${id.padStart(4, "0")}`;
  }

  const entry = getStrongsEntry(id);
  if (!entry) {
    return NextResponse.json({ error: `Strong's entry ${id} not found` }, { status: 404 });
  }

  const letterMeanings = getLetterMeanings();
  const rootLetters = entry.rootLetters.length > 0
    ? entry.rootLetters
    : splitToLetters(entry.wordConsonantal);

  const consonantal = entry.wordConsonantal || toConsonantal(entry.word);
  const paleoHebrew = toPaleoHebrew(consonantal);
  const letterDetails = getLetterDetails(rootLetters, letterMeanings);
  const curatedSentences = getCuratedSentences();
  const curatedData = curatedSentences[consonantal] || undefined;
  const interpretations = generateInterpretations(rootLetters, letterMeanings, {
    maxResults: 10,
    strongsDefinition: entry.definition,
    curatedData,
  });

  return NextResponse.json({
    word: entry.word,
    consonantal,
    strongs: id,
    strongs_definition: entry.definition,
    transliteration: entry.transliteration,
    rootLetters,
    paleoHebrew,
    letters: letterDetails,
    sentences: interpretations,
  });
}
