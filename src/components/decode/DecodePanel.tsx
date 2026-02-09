"use client";

import { useState, useMemo } from "react";
import type { TorahWord, LetterMeaning, InterpretiveSentence } from "@/types";
import { splitToLetters, toPaleoHebrew, calculateGematria, transliterate } from "@/lib/hebrew";
import { generateInterpretations, getLetterDetails } from "@/lib/sentence-engine";
import LetterCard from "./LetterCard";
import SentenceList from "./SentenceList";

interface DecodePanelProps {
  word: TorahWord | null;
  letterMeanings: LetterMeaning[];
  onClose: () => void;
}

export default function DecodePanel({ word, letterMeanings, onClose }: DecodePanelProps) {
  const [hoveredSentence, setHoveredSentence] = useState<InterpretiveSentence | null>(null);

  const decoded = useMemo(() => {
    if (!word) return null;

    const rootLetters = splitToLetters(word.text);
    const paleoHebrew = toPaleoHebrew(word.text);
    const gematria = calculateGematria(word.text);
    const translit = transliterate(word.textNiqqud || word.text);
    const letterDetails = getLetterDetails(rootLetters, letterMeanings);
    const interpretations = generateInterpretations(rootLetters, letterMeanings, {
      maxResults: 10,
    });

    return { rootLetters, paleoHebrew, gematria, translit, letterDetails, interpretations };
  }, [word, letterMeanings]);

  if (!word || !decoded) {
    return (
      <div className="decode-panel h-full flex items-center justify-center p-8 text-center">
        <div>
          <p className="paleo-glyph text-6xl text-border mb-4">𐤀</p>
          <p className="text-muted text-lg">Click any Hebrew word to decode it</p>
          <p className="text-muted text-sm mt-2">
            See Paleo-Hebrew pictographs and interpretive sentences
          </p>
        </div>
      </div>
    );
  }

  // Build a map of highlighted meanings from the hovered sentence
  const highlightMap: Record<string, string> = {};
  if (hoveredSentence) {
    for (const lb of hoveredSentence.letterBreakdown) {
      highlightMap[lb.letter] = lb.chosenMeaning;
    }
  }

  return (
    <div className="decode-panel h-full overflow-y-auto p-4 space-y-6">
      {/* Close button (mobile) */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-2 right-2 text-muted hover:text-foreground text-xl p-1"
        aria-label="Close decode panel"
      >
        &times;
      </button>

      {/* Word Header */}
      <div className="text-center">
        <div className="hebrew-text text-4xl font-semibold" lang="he" dir="rtl">
          {word.textNiqqud || word.text}
        </div>
        <div className="paleo-glyph-large text-primary mt-2" dir="rtl">
          {decoded.paleoHebrew}
        </div>
        <p className="text-lg tracking-wide text-foreground mt-1 font-medium">
          {decoded.translit}
        </p>
        {word.lemma && (
          <p className="text-xs text-muted mt-2">
            Strong&apos;s: {word.lemma}
          </p>
        )}
        <p className="text-sm text-muted mt-1">
          Gematria: {decoded.gematria}
        </p>
      </div>

      {/* Root Decomposition */}
      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Letter Breakdown
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center" dir="rtl">
          {decoded.letterDetails.map((detail, idx) => (
            <LetterCard
              key={idx}
              detail={detail}
              highlightedMeaning={highlightMap[detail.letter]}
            />
          ))}
        </div>
      </div>

      {/* Interpretive Sentences */}
      <SentenceList
        sentences={decoded.interpretations}
        onSentenceHover={setHoveredSentence}
      />

      {/* Scholarly Disclaimer */}
      <p className="text-xs text-muted italic border-t border-border pt-3">
        Pictographic analysis represents one interpretive lens for Hebrew words.
        Scholars debate reading pictographic meanings into fully alphabetic text.
        These readings are offered as enrichment, not as replacement for lexical
        definitions.
      </p>
    </div>
  );
}
