"use client";

import { useState, useRef, useEffect } from "react";
import type { TorahChapter, TorahWord, BookMeta, LetterMeaning, CuratedWordEntry } from "@/types";
import NavigationBar from "@/components/torah/NavigationBar";
import VerseDisplay from "@/components/torah/VerseDisplay";
import DecodePanel from "@/components/decode/DecodePanel";
import { setGlossData } from "@/lib/word-lookup";
import { getChapterNavLinks } from "@/lib/nav-utils";

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

  const bookMeta = books.find((b) => b.slug === bookSlug);
  const { prev, next } = getChapterNavLinks(books, bookSlug, chapter.chapter);

  const handleWordClick = (word: TorahWord, verseRef?: VerseRef) => {
    setSelectedWord(word);
    if (verseRef) setSelectedVerseRef(verseRef);
  };

  const handleClosePanel = () => {
    setSelectedWord(null);
  };

  // Scroll to verse on hash navigation (deep-linking)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.add("verse-highlight");
          setTimeout(() => el.classList.remove("verse-highlight"), 2000);
        }, 300);
      }
    }
  }, []);

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

          {!selectedWord && (
            <p className="text-center py-8 text-sm text-muted italic lg:hidden">
              Tap any Hebrew word above to see its Paleo-Hebrew breakdown
            </p>
          )}

          {chapter.verses.length === 0 && (
            <p className="text-muted text-center py-12">
              No verses available for this chapter yet.
              <br />
              Run the data build script to populate Torah text.
            </p>
          )}
        </div>

        {/* Decode Panel: modal on mobile, sticky sidebar on desktop */}
        {selectedWord && (
          <>
            {/* Mobile backdrop overlay */}
            <div
              className="decode-modal-backdrop"
              onClick={handleClosePanel}
              aria-hidden="true"
            />
            <div
              ref={decodePanelRef}
              className="decode-modal-panel rounded-xl border border-border bg-decode-bg decode-panel"
            >
              {/* Mobile drag handle */}
              <div className="lg:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Mobile close button */}
              <div className="lg:hidden absolute top-3 right-3 z-10">
                <button
                  onClick={handleClosePanel}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-hover hover:bg-border transition-colors text-muted"
                  aria-label="Close decode panel"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <DecodePanel
                word={selectedWord}
                verseRef={selectedVerseRef}
                letterMeanings={letterMeanings}
                curatedSentences={curatedSentences}
                onClose={handleClosePanel}
              />
            </div>
          </>
        )}
      </div>

      {/* Bottom chapter navigation */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex justify-between items-center">
          {prev ? (
            <a
              href={prev.href}
              className="group flex flex-col text-left"
            >
              <span className="text-xs text-muted uppercase tracking-wide">&larr; Previous</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {prev.label}
              </span>
            </a>
          ) : (
            <div />
          )}
          {next ? (
            <a
              href={next.href}
              className="group flex flex-col text-right ml-auto"
            >
              <span className="text-xs text-muted uppercase tracking-wide">Next &rarr;</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {next.label}
              </span>
            </a>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
