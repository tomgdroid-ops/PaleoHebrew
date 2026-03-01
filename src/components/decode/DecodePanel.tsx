"use client";

import { useMemo, useCallback } from "react";
import type { TorahWord, LetterMeaning, CuratedWordEntry } from "@/types";
import { splitToLetters, toPaleoHebrew, calculateGematria, transliterate, toConsonantal } from "@/lib/hebrew";
import { generateInterpretations, getLetterDetails } from "@/lib/sentence-engine";
import { lookupById, lookupWord } from "@/lib/word-lookup";
import { PaleoWordGlyphs } from "./PaleoGlyph";
import LetterCard from "./LetterCard";
import SentenceList from "./SentenceList";
import type { VerseRef } from "@/app/torah/[book]/[chapter]/ChapterView";

interface DecodePanelProps {
  word: TorahWord | null;
  verseRef?: VerseRef | null;
  letterMeanings: LetterMeaning[];
  curatedSentences: Record<string, CuratedWordEntry>;
  onClose: () => void;
}

export default function DecodePanel({ word, verseRef, letterMeanings, curatedSentences, onClose }: DecodePanelProps) {
  const decoded = useMemo(() => {
    if (!word) return null;

    const rootLetters = splitToLetters(word.text);
    const paleoHebrew = toPaleoHebrew(word.text);
    const gematria = calculateGematria(word.text);
    const translit = transliterate(word.textNiqqud || word.text);
    const letterDetails = getLetterDetails(rootLetters, letterMeanings);

    // Look up curated data for this word (using consonantal form)
    const consonantal = toConsonantal(word.text);
    const curatedData = curatedSentences[consonantal] || undefined;

    const interpretations = generateInterpretations(rootLetters, letterMeanings, {
      maxResults: 10,
      curatedData,
    });

    return { rootLetters, paleoHebrew, gematria, translit, letterDetails, interpretations };
  }, [word, letterMeanings, curatedSentences]);

  const gloss = useMemo(() => {
    if (!word) return null;
    return (word.lemma ? lookupById(word.lemma) : null) || lookupWord(word.text);
  }, [word]);

  const handleGenerateReport = useCallback(() => {
    if (!word || !decoded) return;

    // Serialize all report data to sessionStorage
    const reportData = {
      word: {
        text: word.text,
        textNiqqud: word.textNiqqud,
        lemma: word.lemma,
        morph: word.morph,
        position: word.position,
      },
      verseRef: verseRef || null,
      decoded: {
        rootLetters: decoded.rootLetters,
        paleoHebrew: decoded.paleoHebrew,
        gematria: decoded.gematria,
        translit: decoded.translit,
        letterDetails: decoded.letterDetails,
        interpretations: decoded.interpretations,
      },
      gloss: gloss ? { id: gloss.id, gloss: gloss.gloss, translit: gloss.translit } : null,
      generatedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("wordReportData", JSON.stringify(reportData));
    window.open("/report", "_blank");
  }, [word, verseRef, decoded, gloss]);

  if (!word || !decoded) return null;

  return (
    <div className="p-6">
      {/* Header with report and close buttons */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-center flex-1">
          <div className="hebrew-text text-3xl font-semibold" lang="he" dir="rtl">
            {word.textNiqqud || word.text}
          </div>
          <div className="flex justify-center mt-1">
            <PaleoWordGlyphs hebrewWord={word.textNiqqud || word.text} size="xl" />
          </div>
          <p className="text-base tracking-wide text-foreground mt-1 font-medium italic">
            {decoded.translit}
          </p>
          {gloss && (
            <p className="text-lg font-bold text-accent mt-1">
              &ldquo;{gloss.gloss}&rdquo;
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-1 text-xs text-muted">
            <span>Gematria: {decoded.gematria}</span>
          </div>
          {/* Generate Report button */}
          <button
            onClick={handleGenerateReport}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:text-foreground border border-primary/30 hover:border-primary/60 rounded-lg px-3 py-1.5 transition-colors"
            title="Generate printable word report"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Generate Report
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-foreground text-xl p-1 ml-2"
          aria-label="Close decode panel"
        >
          &#x2715;
        </button>
      </div>

      {/* Two-column layout: sentences (60%) | letters (40%) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Generated Sentences (60%) */}
        <div className="lg:w-[60%]">
          <SentenceList sentences={decoded.interpretations} />
        </div>

        {/* Right: Letter Breakdown (40%) */}
        <div className="lg:w-[40%]">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
            Letter Breakdown
          </h3>
          <div className="flex flex-wrap gap-2 justify-center" dir="rtl">
            {decoded.letterDetails.map((detail, idx) => (
              <LetterCard key={idx} detail={detail} />
            ))}
          </div>
        </div>
      </div>

      {/* Scholarly Disclaimer */}
      <p className="text-xs text-muted italic border-t border-border pt-3 mt-6">
        Pictographic analysis represents one interpretive approach to Hebrew.
        These readings are study aids, not replacements for lexical definitions.
      </p>
    </div>
  );
}
