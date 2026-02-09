"use client";

import type { BookMeta } from "@/types";

interface NavigationBarProps {
  books: BookMeta[];
  currentBook: string;
  currentChapter: number;
}

export default function NavigationBar({
  books,
  currentBook,
  currentChapter,
}: NavigationBarProps) {
  const book = books.find((b) => b.slug === currentBook);
  const totalChapters = book?.chapters || 1;
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  // Find previous/next book for cross-book navigation
  const bookIdx = books.findIndex((b) => b.slug === currentBook);
  const prevBook = bookIdx > 0 ? books[bookIdx - 1] : null;
  const nextBook = bookIdx < books.length - 1 ? books[bookIdx + 1] : null;

  const prevHref = hasPrev
    ? `/torah/${currentBook}/${currentChapter - 1}`
    : prevBook
    ? `/torah/${prevBook.slug}/${prevBook.chapters}`
    : null;

  const nextHref = hasNext
    ? `/torah/${currentBook}/${currentChapter + 1}`
    : nextBook
    ? `/torah/${nextBook.slug}/1`
    : null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Book selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {books.map((b) => (
          <a
            key={b.slug}
            href={`/torah/${b.slug}/1`}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              b.slug === currentBook
                ? "bg-primary text-white font-medium"
                : "bg-surface hover:bg-surface-hover text-muted border border-border"
            }`}
          >
            {b.name}
          </a>
        ))}
      </div>

      {/* Chapter navigation */}
      <div className="flex items-center gap-2">
        {prevHref && (
          <a
            href={prevHref}
            className="text-sm px-3 py-1.5 rounded-md bg-surface hover:bg-surface-hover border border-border text-muted"
            aria-label="Previous chapter"
          >
            &larr; Prev
          </a>
        )}

        {/* Chapter selector dropdown */}
        <div className="relative">
          <select
            value={currentChapter}
            onChange={(e) => {
              window.location.href = `/torah/${currentBook}/${e.target.value}`;
            }}
            className="text-sm px-3 py-1.5 rounded-md bg-surface border border-border text-foreground appearance-none pr-8 cursor-pointer"
            aria-label="Select chapter"
          >
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
              <option key={ch} value={ch}>
                Chapter {ch}
              </option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-xs">
            &#9662;
          </span>
        </div>

        {nextHref && (
          <a
            href={nextHref}
            className="text-sm px-3 py-1.5 rounded-md bg-surface hover:bg-surface-hover border border-border text-muted"
            aria-label="Next chapter"
          >
            Next &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
