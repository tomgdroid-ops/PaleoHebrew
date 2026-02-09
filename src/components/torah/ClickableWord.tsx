"use client";

import type { TorahWord } from "@/types";

interface ClickableWordProps {
  word: TorahWord;
  isSelected: boolean;
  onClick: (word: TorahWord) => void;
}

export default function ClickableWord({ word, isSelected, onClick }: ClickableWordProps) {
  return (
    <button
      type="button"
      className={`hebrew-word hebrew-text text-2xl ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(word)}
      lang="he"
      dir="rtl"
      aria-label={`Hebrew word: ${word.textNiqqud || word.text}`}
      title={word.textNiqqud || word.text}
    >
      {word.textNiqqud || word.text}
    </button>
  );
}
