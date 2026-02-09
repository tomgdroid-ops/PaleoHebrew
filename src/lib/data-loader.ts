/**
 * Data loader for static JSON files.
 * Loads Torah text, Strong's dictionary, and letter meanings at runtime.
 * All data is cached after first load.
 */

import * as fs from "fs";
import * as path from "path";
import type {
  BookMeta,
  TorahBook,
  TorahChapter,
  TorahVerse,
  LetterMeaning,
  StrongsEntry,
} from "@/types";

const DATA_DIR = path.resolve(process.cwd(), "data");

// Caches
let _booksMeta: BookMeta[] | null = null;
let _letterMeanings: LetterMeaning[] | null = null;
let _strongs: Record<string, StrongsEntry> | null = null;
const _bookCache = new Map<string, TorahBook>();

/**
 * Load the books metadata (navigation info).
 */
export function getBooksMeta(): BookMeta[] {
  if (_booksMeta) return _booksMeta;

  const filePath = path.join(DATA_DIR, "torah", "books.json");
  if (!fs.existsSync(filePath)) return [];

  _booksMeta = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return _booksMeta!;
}

/**
 * Load a full Torah book's data.
 */
export function getBook(slug: string): TorahBook | null {
  if (_bookCache.has(slug)) return _bookCache.get(slug)!;

  const filePath = path.join(DATA_DIR, "torah", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;

  const book: TorahBook = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  _bookCache.set(slug, book);
  return book;
}

/**
 * Get a specific chapter from a book.
 */
export function getChapter(bookSlug: string, chapter: number): TorahChapter | null {
  const book = getBook(bookSlug);
  if (!book) return null;

  const chapterData = book.chapters.find((c) => c.chapter === chapter);
  return chapterData || null;
}

/**
 * Get a specific verse.
 */
export function getVerse(
  bookSlug: string,
  chapter: number,
  verse: number
): TorahVerse | null {
  const chapterData = getChapter(bookSlug, chapter);
  if (!chapterData) return null;

  return chapterData.verses.find((v) => v.verse === verse) || null;
}

/**
 * Load the letter meanings matrix.
 */
export function getLetterMeanings(): LetterMeaning[] {
  if (_letterMeanings) return _letterMeanings;

  const filePath = path.join(DATA_DIR, "letter-meanings.json");
  if (!fs.existsSync(filePath)) return [];

  _letterMeanings = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return _letterMeanings!;
}

/**
 * Load the Strong's dictionary.
 */
export function getStrongsDictionary(): Record<string, StrongsEntry> {
  if (_strongs) return _strongs;

  const filePath = path.join(DATA_DIR, "strongs.json");
  if (!fs.existsSync(filePath)) return {};

  _strongs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return _strongs!;
}

/**
 * Look up a single Strong's entry.
 */
export function getStrongsEntry(id: string): StrongsEntry | null {
  const dict = getStrongsDictionary();
  return dict[id] || null;
}
