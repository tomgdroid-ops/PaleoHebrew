import { NextResponse } from "next/server";
import { getLetterMeanings, getStrongsEntry, getCuratedSentences } from "@/lib/data-loader";
import { splitToLetters, toPaleoHebrew, toConsonantal } from "@/lib/hebrew";
import { generateInterpretations, getLetterDetails } from "@/lib/sentence-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");
  const lemma = searchParams.get("lemma");

  if (!word && !lemma) {
    return NextResponse.json(
      { error: "Must provide 'word' or 'lemma' query parameter" },
      { status: 400 }
    );
  }

  const letterMeanings = getLetterMeanings();

  // Determine root letters
  let rootLetters: string[];
  let strongsDef: string | undefined;
  let consonantal: string;

  if (lemma) {
    const entry = getStrongsEntry(lemma);
    if (entry) {
      rootLetters = entry.rootLetters;
      strongsDef = entry.definition;
      consonantal = entry.wordConsonantal;
    } else {
      // Fallback: use the word parameter
      consonantal = word ? toConsonantal(word) : "";
      rootLetters = splitToLetters(consonantal);
    }
  } else {
    consonantal = toConsonantal(word!);
    rootLetters = splitToLetters(consonantal);
  }

  if (rootLetters.length === 0) {
    return NextResponse.json(
      { error: "Could not extract root letters from input" },
      { status: 400 }
    );
  }

  const paleoHebrew = toPaleoHebrew(consonantal);
  const letterDetails = getLetterDetails(rootLetters, letterMeanings);
  const curatedSentences = getCuratedSentences();
  const curatedData = curatedSentences[consonantal] || undefined;
  const interpretations = generateInterpretations(rootLetters, letterMeanings, {
    maxResults: 10,
    strongsDefinition: strongsDef,
    curatedData,
  });

  return NextResponse.json({
    word: word || consonantal,
    consonantal,
    lemma: lemma || null,
    rootLetters,
    paleoHebrew,
    letterDetails,
    interpretations,
  });
}
