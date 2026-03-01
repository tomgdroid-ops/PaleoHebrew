"use client";

import { useState, useRef } from "react";
import type { TorahChapter, TorahWord, BookMeta, LetterMeaning, CuratedWordEntry } from "@/types";
import NavigationBar from "@/components/torah/NavigationBar";
import VerseDisplay from "@/components/torah/VerseDisplay";
import DecodePanel from "@/components/decode/DecodePanel";
import { setGlossData } from "@/lib/word-lookup";

interface ChapterViewProps {
  chapter: TorahChapter;
  books: BookMeta[];
  bookSlug: string;
  letterMeanings: LetterMeaning[];
  wordGlosses: Record<string, unknown>;
  curatedSentences: Record<string, CuratedWordEntry>;
}

export interface VerseRef {
  book: string;
  bookHe: string;
  chapter: number;
  verse: number;
}

export default function ChapterView({
  chapter,
  books,
  bookSlug,
  letterMeanings,
  wordGlosses,
  curatedSentences,
}: ChapterViewProps) {
  const [selectedWord, setSelectedWord] = useState<TorahWord | null>(null);
  const [selectedVerseRef, setSelectedVerseRef] = useState<VerseRef | null>(null);
  const decodePanelRef = useRef<HTMLDivElement>(null);

  // Set gloss data synchronously so it's available during render of child components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setGlossData(wordGlosses as any);

  const handleWordClick = (word: TorahWord, verseRef?: VerseRef) => {
    setSelectedWord(word);
    if (verseRef) setSelectedVerseRef(verseRef);
  };

  const handleClosePanel = () => {
    setSelectedWord(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-4">
      {/* Navigation */}
      <NavigationBar
        books={books}
        currentBook={bookSlug}
        currentChapter={chapter.chapter}
      />

      {/* Chapter header */}
      <div className="mt-4 mb-2">
        <h2 className="text-2xl font-semibold">
          {chapter.book} {chapter.chapter}
        </h2>
        <p className="hebrew-text text-lg text-muted" lang="he" dir="rtl">
          {chapter.bookHe} {chapter.chapter}
        </p>
      </div>

      {/* Two-column layout: Verses (left, scrollable) | Decode Panel (right, sticky) */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Verse Display Area */}
        <div className={`${selectedWord ? "lg:w-[55%]" : "w-full"} transition-all duration-300`}>
          {chapter.verses.map((verse) => (
            <VerseDisplay
              key={verse.verse}
              verse={verse}
              selectedWord={selectedWord}
              onWordClick={(word) =>
                handleWordClick(word, {
                  book: chapter.book,
                  bookHe: chapter.bookHe,
                  chapter: chapter.chapter,
                  verse: verse.verse,
                })
              }
            />
          ))}

          {chapter.verses.length === 0 && (
            <p className="text-muted text-center py-12">
              No verses available for this chapter yet.
              <br />
              Run the data build script to populate Torah text.
            </p>
          )}
        </div>

        {/* Right: Sticky Decode Panel */}
        {selectedWord && (
          <div
            ref={decodePanelRef}
            className="lg:w-[45%] lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto rounded-xl border border-border bg-decode-bg decode-panel"
          >
            <DecodePanel
              word={selectedWord}
              verseRef={selectedVerseRef}
              letterMeanings={letterMeanings}
              curatedSentences={curatedSentences}
              onClose={handleClosePanel}
            />
          </div>
        )}
      </div>
    </div>
  );
}
