import type { BookMeta } from "@/types";

export interface ChapterNavLink {
  href: string;
  label: string;
}

/**
 * Compute prev/next chapter links, including cross-book boundaries.
 */
export function getChapterNavLinks(
  books: BookMeta[],
  bookSlug: string,
  currentChapter: number
): { prev: ChapterNavLink | null; next: ChapterNavLink | null } {
  const book = books.find((b) => b.slug === bookSlug);
  if (!book) return { prev: null, next: null };

  const totalChapters = book.chapters;
  const bookIdx = books.findIndex((b) => b.slug === bookSlug);
  const prevBook = bookIdx > 0 ? books[bookIdx - 1] : null;
  const nextBook = bookIdx < books.length - 1 ? books[bookIdx + 1] : null;

  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  const prev: ChapterNavLink | null = hasPrev
    ? {
        href: `/torah/${bookSlug}/${currentChapter - 1}`,
        label: `${book.name} ${currentChapter - 1}`,
      }
    : prevBook
    ? {
        href: `/torah/${prevBook.slug}/${prevBook.chapters}`,
        label: `${prevBook.name} ${prevBook.chapters}`,
      }
    : null;

  const next: ChapterNavLink | null = hasNext
    ? {
        href: `/torah/${bookSlug}/${currentChapter + 1}`,
        label: `${book.name} ${currentChapter + 1}`,
      }
    : nextBook
    ? {
        href: `/torah/${nextBook.slug}/1`,
        label: `${nextBook.name} 1`,
      }
    : null;

  return { prev, next };
}
