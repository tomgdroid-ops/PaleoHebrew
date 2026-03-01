import { NextResponse } from "next/server";
import { getLetterMeanings, getCuratedSentences } from "@/lib/data-loader";
import { splitToLetters, toPaleoHebrew, toConsonantal, calculateGematria, transliterate } from "@/lib/hebrew";
import { generateInterpretations, getLetterDetails } from "@/lib/sentence-engine";

export async function POST(request: Request) {
  let body: { word?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const word = body.word;
  if (!word) {
    return NextResponse.json(
      { error: "Must provide 'word' field in JSON body" },
      { status: 400 }
    );
  }

  const letterMeanings = getLetterMeanings();
  const consonantal = toConsonantal(word);
  const rootLetters = splitToLetters(consonantal);

  if (rootLetters.length === 0) {
    return NextResponse.json(
      { error: "Could not extract Hebrew letters from input" },
      { status: 400 }
    );
  }

  const paleoHebrew = toPaleoHebrew(consonantal);
  const gematria = calculateGematria(consonantal);
  const translit = transliterate(word);
  const letterDetails = getLetterDetails(rootLetters, letterMeanings);
  const curatedSentences = getCuratedSentences();
  const curatedData = curatedSentences[consonantal] || undefined;
  const interpretations = generateInterpretations(rootLetters, letterMeanings, {
    maxResults: 10,
    curatedData,
  });

  return NextResponse.json({
    word,
    consonantal,
    transliteration: translit,
    gematria,
    rootLetters,
    paleoHebrew,
    letters: letterDetails,
    sentences: interpretations,
  });
}
