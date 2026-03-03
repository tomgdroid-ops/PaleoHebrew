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
    <div id={`v${verse.verse}`} className="verse-block group">
      {/* Verse reference */}
      <div className="verse-ref flex items-center">
        {verse.chapter}:{verse.verse}
        <button
          onClick={() => {
            const url = `${window.location.pathname}#v${verse.verse}`;
            navigator.clipboard.writeText(window.location.origin + url);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-primary ml-1"
          aria-label={`Copy link to verse ${verse.verse}`}
          title="Copy verse link"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
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
