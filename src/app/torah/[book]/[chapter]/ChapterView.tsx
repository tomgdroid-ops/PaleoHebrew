"use client";

import { useState } from "react";
import type { TorahChapter, TorahWord, BookMeta, LetterMeaning } from "@/types";
import NavigationBar from "@/components/torah/NavigationBar";
import VerseDisplay from "@/components/torah/VerseDisplay";
import DecodePanel from "@/components/decode/DecodePanel";

interface ChapterViewProps {
  chapter: TorahChapter;
  books: BookMeta[];
  bookSlug: string;
  letterMeanings: LetterMeaning[];
}

export default function ChapterView({
  chapter,
  books,
  bookSlug,
  letterMeanings,
}: ChapterViewProps) {
  const [selectedWord, setSelectedWord] = useState<TorahWord | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const handleWordClick = (word: TorahWord) => {
    setSelectedWord(word);
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setSelectedWord(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Navigation */}
      <NavigationBar
        books={books}
        currentBook={bookSlug}
        currentChapter={chapter.chapter}
      />

      {/* Chapter header */}
      <div className="mt-4 mb-6">
        <h2 className="text-2xl font-semibold">
          {chapter.book} {chapter.chapter}
        </h2>
        <p className="hebrew-text text-lg text-muted" lang="he" dir="rtl">
          {chapter.bookHe} {chapter.chapter}
        </p>
      </div>

      {/* Main content: verses + decode panel */}
      <div className="flex gap-6">
        {/* Verses column */}
        <div className={`flex-1 min-w-0 ${showPanel ? "lg:max-w-[60%]" : ""}`}>
          <div className="space-y-1">
            {chapter.verses.map((verse) => (
              <VerseDisplay
                key={verse.verse}
                verse={verse}
                selectedWord={selectedWord}
                onWordClick={handleWordClick}
              />
            ))}
          </div>

          {chapter.verses.length === 0 && (
            <p className="text-muted text-center py-12">
              No verses available for this chapter yet.
              <br />
              Run the data build script to populate Torah text.
            </p>
          )}
        </div>

        {/* Decode panel - desktop sidebar */}
        <div
          className={`hidden lg:block w-[400px] flex-shrink-0 transition-all duration-300 ${
            showPanel ? "opacity-100" : "opacity-50"
          }`}
        >
          <div className="sticky top-4 bg-decode-bg rounded-xl border border-border max-h-[calc(100vh-6rem)] overflow-hidden">
            <DecodePanel
              word={selectedWord}
              letterMeanings={letterMeanings}
              onClose={handleClosePanel}
            />
          </div>
        </div>
      </div>

      {/* Decode panel - mobile bottom sheet */}
      {showPanel && selectedWord && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleClosePanel}
          />
          {/* Panel */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-decode-bg rounded-t-2xl border-t border-border overflow-hidden">
            <div className="w-12 h-1 bg-border rounded-full mx-auto mt-2" />
            <DecodePanel
              word={selectedWord}
              letterMeanings={letterMeanings}
              onClose={handleClosePanel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
