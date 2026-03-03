"use client";

import { useState } from "react";
import type { InterpretiveSentence } from "@/types";

// Theme detection: check which themes a sentence's meanings match
const THEMES: Record<string, string[]> = {
  creation: ["create", "make", "beginning", "first", "work", "complete"],
  covenant: ["covenant", "sign", "mark", "seal", "promise", "oath", "cross"],
  redemption: ["save", "deliver", "cross", "sacrifice", "blood", "destroy", "consume"],
  family: ["father", "mother", "son", "house", "family", "seed", "offspring", "heir"],
  authority: ["leader", "chief", "head", "ruler", "king", "authority", "shepherd", "guide"],
  divine: ["god", "strength", "power", "spirit", "breath", "mighty", "fire"],
};

function detectThemes(sentence: InterpretiveSentence): string[] {
  const words = [
    ...sentence.sentence.toLowerCase().split(/[\s,;:.]+/),
    ...sentence.letterBreakdown.map(lb => lb.chosenMeaning.toLowerCase().replace(/^to /, "")),
  ];

  const matched: string[] = [];
  for (const [theme, keywords] of Object.entries(THEMES)) {
    for (const kw of keywords) {
      if (words.some(w => w.includes(kw) || kw.includes(w))) {
        matched.push(theme);
        break;
      }
    }
  }
  return matched;
}

function getScoreBadgeClass(score: number): string {
  if (score >= 70) return "score-badge score-badge-high";
  if (score >= 45) return "score-badge score-badge-medium";
  return "score-badge score-badge-low";
}

interface SentenceListProps {
  sentences: InterpretiveSentence[];
}

export default function SentenceList({ sentences }: SentenceListProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (sentences.length === 0) {
    return (
      <p className="text-muted text-sm italic">
        No interpretive sentences could be generated for this word.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3 flex items-center gap-1.5">
        Pictographic Interpretations
        <span className="relative group inline-flex items-center">
          <span className="w-4 h-4 rounded-full border border-muted/50 text-muted text-[10px] font-semibold flex items-center justify-center cursor-help">
            ?
          </span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-60 p-2.5 text-xs normal-case tracking-normal bg-surface border border-border rounded-lg shadow-lg text-muted z-20 leading-relaxed">
            Scores reflect how closely the pictographic interpretation aligns with established scholarly consensus for each letter meaning. Higher scores indicate primary, widely-accepted pictographic meanings.
          </span>
        </span>
      </h3>

      <div className="sentence-list space-y-2">
        {sentences.map((sentence, idx) => {
          // Use curated themes if available, otherwise detect algorithmically
          const themes = sentence.themes && sentence.themes.length > 0
            ? sentence.themes
            : detectThemes(sentence);
          return (
            <div
              key={idx}
              className={`rounded-lg border p-3 cursor-pointer hover:border-primary/30 transition-colors ${
                sentence.curated
                  ? "border-primary/20 bg-surface"
                  : "border-border bg-surface"
              }`}
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="flex items-start gap-3">
                {/* Score badge (colored circle) */}
                <span className={getScoreBadgeClass(sentence.score)}>
                  {sentence.score}
                </span>

                {/* Sentence content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground leading-relaxed" style={{ fontSize: "16px" }}>
                      {sentence.sentence}
                    </p>
                    {sentence.curated && (
                      <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary rounded px-1.5 py-0.5 shrink-0">
                        curated
                      </span>
                    )}
                  </div>

                  {/* Letter meaning tags: letter=meaning */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sentence.letterBreakdown.map((lb, lbIdx) => (
                      <span
                        key={lbIdx}
                        className="inline-flex items-center gap-0.5 text-xs bg-decode-bg rounded px-1.5 py-0.5"
                      >
                        <span className="hebrew-text font-semibold" lang="he">
                          {lb.letter}
                        </span>
                        <span className="text-muted">=</span>
                        <span className="text-primary font-medium">
                          {lb.chosenMeaning}
                        </span>
                      </span>
                    ))}
                  </div>

                  {/* Theme pills */}
                  {themes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {themes.map((theme) => (
                        <span key={theme} className="theme-pill">
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {expandedIdx === idx && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted mb-2">Detailed letter meanings used:</p>
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
                  <p className="text-xs text-muted mt-2">
                    Source: {sentence.curated ? "Hand-crafted reading" : `Template ${sentence.pattern}`}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
