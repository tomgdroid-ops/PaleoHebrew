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
    <div className="verse-block">
      {/* Verse reference */}
      <div className="verse-ref">
        {verse.chapter}:{verse.verse}
      </div>

      {/* Interlinear word stacks: LTR for English readers, wrapping */}
      <div className="verse-container">
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
      </div>
    </div>
  );
}
