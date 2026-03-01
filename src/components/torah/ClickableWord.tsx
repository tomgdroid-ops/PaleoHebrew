"use client";

import type { TorahWord } from "@/types";
import { transliterate } from "@/lib/hebrew";
import { lookupWord, lookupById } from "@/lib/word-lookup";
import { PaleoWordGlyphs } from "@/components/decode/PaleoGlyph";

interface ClickableWordProps {
  word: TorahWord;
  isSelected: boolean;
  onClick: (word: TorahWord) => void;
}

export default function ClickableWord({ word, isSelected, onClick }: ClickableWordProps) {
  const translit = transliterate(word.textNiqqud || word.text);
  // Try Strong's ID lookup first (from OSHB data), fall back to consonantal lookup
  const gloss = (word.lemma ? lookupById(word.lemma) : null) || lookupWord(word.text);

  return (
    <button
      type="button"
      className={`interlinear-word ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(word)}
      aria-label={`Hebrew word: ${word.textNiqqud || word.text} - ${gloss?.gloss || ""}`}
    >
      {/* Row 1: Paleo-Hebrew (SVG images) */}
      <PaleoWordGlyphs hebrewWord={word.text} size="sm" />

      {/* Row 2: Modern Hebrew + Strong's number (same line) */}
      <span className="interlinear-hebrew-line" dir="rtl">
        <span className="interlinear-strongs">
          {(word.lemma || gloss?.id || "").replace("H0", "").replace("H", "")}
        </span>
        <span className="hebrew-text interlinear-hebrew" lang="he">
          {word.textNiqqud || word.text}
        </span>
      </span>

      {/* Row 3: Transliteration */}
      <span className="interlinear-translit">
        {translit}
      </span>

      {/* Row 4: English gloss (bold, bottom) */}
      <span className="interlinear-english">
        {gloss?.gloss || "\u2014"}
      </span>
    </button>
  );
}
