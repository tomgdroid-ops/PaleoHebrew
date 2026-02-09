"use client";

import { useState } from "react";
import type { InterpretiveSentence } from "@/types";

interface SentenceListProps {
  sentences: InterpretiveSentence[];
  onSentenceHover?: (sentence: InterpretiveSentence | null) => void;
}

function getScoreClass(score: number): string {
  if (score >= 70) return "score-high";
  if (score >= 45) return "score-medium";
  return "score-low";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Strong";
  if (score >= 45) return "Moderate";
  return "Exploratory";
}

export default function SentenceList({ sentences, onSentenceHover }: SentenceListProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (sentences.length === 0) {
    return (
      <p className="text-muted text-sm italic">
        No interpretive sentences could be generated for this word.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wide">
        Pictographic Interpretations
      </h3>

      {sentences.map((sentence, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-border bg-surface p-3 cursor-pointer hover:border-primary/30 transition-colors"
          onMouseEnter={() => onSentenceHover?.(sentence)}
          onMouseLeave={() => onSentenceHover?.(null)}
          onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
        >
          <div className="flex items-start gap-3">
            {/* Rank number */}
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
              {idx + 1}
            </span>

            {/* Sentence */}
            <div className="flex-1">
              <p className="text-foreground font-medium leading-relaxed">
                {sentence.sentence}
              </p>

              {/* Score badge */}
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium ${getScoreClass(sentence.score)}`}>
                  {getScoreLabel(sentence.score)}
                </span>
                <span className="text-xs text-muted">
                  Score: {sentence.score}/100
                </span>
              </div>
            </div>
          </div>

          {/* Expanded letter breakdown */}
          {expandedIdx === idx && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted mb-2">Letter meanings used:</p>
              <div className="flex flex-wrap gap-2" dir="rtl">
                {sentence.letterBreakdown.map((lb, lbIdx) => (
                  <span
                    key={lbIdx}
                    className="inline-flex items-center gap-1 text-xs bg-decode-bg rounded px-2 py-1"
                  >
                    <span className="hebrew-text font-semibold" lang="he">
                      {lb.letter}
                    </span>
                    <span className="text-muted">=</span>
                    <span className="text-primary font-medium">
                      {lb.chosenMeaning}
                    </span>
                    <span className="text-muted">({lb.role})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
