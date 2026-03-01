"use client";

import PaleoGlyph from "./PaleoGlyph";
import type { LetterInterpretation } from "@/types";

interface LetterCardProps {
  detail: LetterInterpretation;
  highlightedMeaning?: string;
}

export default function LetterCard({ detail, highlightedMeaning }: LetterCardProps) {
  // Find gematria from allMeanings parent data - we store it on the letter data
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-surface border border-border min-w-[100px] max-w-[130px]">
      {/* Paleo-Hebrew SVG glyph */}
      <PaleoGlyph
        paleoChar={detail.paleoUnicode}
        letterName={detail.name}
        size="lg"
      />

      {/* Modern Hebrew letter */}
      <span className="hebrew-text text-2xl mt-1" lang="he">
        {detail.letter}
      </span>

      {/* Letter name */}
      <span className="text-sm font-semibold text-primary mt-1">
        {detail.name}
      </span>

      {/* Pictograph description */}
      <span className="text-xs text-muted italic text-center">
        {detail.pictograph}
      </span>

      {/* Meaning tags (top 4) */}
      <div className="mt-2 flex flex-wrap gap-1 justify-center">
        {detail.allMeanings.slice(0, 4).map((meaning) => (
          <span
            key={meaning.text}
            className={`text-xs px-1.5 py-0.5 rounded ${
              meaning.text === highlightedMeaning
                ? "bg-accent text-white font-semibold"
                : meaning.primary
                ? "bg-accent-light/30 text-foreground"
                : "bg-surface-hover text-muted"
            }`}
          >
            {meaning.text}
          </span>
        ))}
      </div>
    </div>
  );
}
