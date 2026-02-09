"use client";

import type { TorahVerse, TorahWord } from "@/types";
import ClickableWord from "./ClickableWord";

interface VerseDisplayProps {
  verse: TorahVerse;
  selectedWord: TorahWord | null;
  onWordClick: (word: TorahWord) => void;
}

export default function VerseDisplay({
  verse,
  selectedWord,
  onWordClick,
}: VerseDisplayProps) {
  return (
    <div className="py-3 border-b border-border/50 last:border-b-0">
      {/* Verse reference */}
      <span className="text-xs text-muted font-mono mr-2">
        {verse.chapter}:{verse.verse}
      </span>

      {/* Hebrew text with clickable words */}
      <div className="mt-1" dir="rtl" lang="he">
        <span className="inline-flex flex-wrap gap-1 justify-end">
          {verse.words.map((word, idx) => (
            <ClickableWord
              key={idx}
              word={word}
              isSelected={
                selectedWord !== null &&
                selectedWord.position === word.position &&
                selectedWord.text === word.text
              }
              onClick={onWordClick}
            />
          ))}
        </span>
      </div>

      {/* English translation */}
      {verse.english && (
        <p className="text-sm text-muted mt-1 leading-relaxed">
          {verse.english}
        </p>
      )}
    </div>
  );
}
