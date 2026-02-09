"use client";

import type { TorahWord } from "@/types";
import { toPaleoHebrew, transliterate } from "@/lib/hebrew";
import { lookupWord } from "@/lib/word-lookup";

interface ClickableWordProps {
  word: TorahWord;
  isSelected: boolean;
  onClick: (word: TorahWord) => void;
}

export default function ClickableWord({ word, isSelected, onClick }: ClickableWordProps) {
  const paleo = toPaleoHebrew(word.text);
  const translit = transliterate(word.textNiqqud || word.text);
  const gloss = lookupWord(word.text);

  return (
    <button
      type="button"
      className={`interlinear-word ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(word)}
      aria-label={`Hebrew word: ${word.textNiqqud || word.text} - ${gloss?.gloss || ""}`}
    >
      {/* Row 1: Paleo-Hebrew */}
      <span className="paleo-glyph interlinear-paleo" dir="rtl">
        {paleo}
      </span>

      {/* Row 2: Modern Hebrew + Strong's number */}
      <span className="interlinear-hebrew-row">
        {gloss && (
          <span className="interlinear-strongs">
            {gloss.id.replace("H0", "").replace("H", "")}
          </span>
        )}
        <span className="hebrew-text interlinear-hebrew" lang="he" dir="rtl">
          {word.textNiqqud || word.text}
        </span>
      </span>

      {/* Row 3: Transliteration */}
      <span className="interlinear-translit">
        {translit}
      </span>

      {/* Row 4: English gloss */}
      <span className="interlinear-english">
        {gloss?.gloss || "—"}
      </span>
    </button>
  );
}
