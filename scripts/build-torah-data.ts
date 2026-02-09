/**
 * Build script: Download and transform Torah text data.
 *
 * Source: Sefaria API v2 (https://www.sefaria.org/api/texts/)
 * Output: data/torah/{book}.json and data/torah/books.json
 */

import * as fs from "fs";
import * as path from "path";

const BOOKS = [
  { name: "Genesis", nameHe: "בראשית", slug: "genesis", sefariaName: "Genesis", chapters: 50 },
  { name: "Exodus", nameHe: "שמות", slug: "exodus", sefariaName: "Exodus", chapters: 40 },
  { name: "Leviticus", nameHe: "ויקרא", slug: "leviticus", sefariaName: "Leviticus", chapters: 27 },
  { name: "Numbers", nameHe: "במדבר", slug: "numbers", sefariaName: "Numbers", chapters: 36 },
  { name: "Deuteronomy", nameHe: "דברים", slug: "deuteronomy", sefariaName: "Deuteronomy", chapters: 34 },
];

const DATA_DIR = path.resolve(__dirname, "..", "data", "torah");
const SEFARIA_BASE = "https://www.sefaria.org/api/texts/";

function stripNikkud(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, "");
}

function normalizeFinals(text: string): string {
  const finals: Record<string, string> = {
    "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ",
  };
  return [...text].map((ch) => finals[ch] || ch).join("");
}

function cleanHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface VerseData {
  book: string;
  bookHe: string;
  chapter: number;
  verse: number;
  text: string;
  english: string;
  words: WordData[];
}

interface WordData {
  text: string;
  textNiqqud: string;
  lemma: string;
  morph: string;
  position: number;
}

/**
 * Split a Hebrew verse into words.
 */
function splitVerseIntoWords(hebrewTextNiqqud: string): WordData[] {
  const rawWords = hebrewTextNiqqud.split(/\s+/).filter((w) => w.length > 0);

  return rawWords.map((word, index) => {
    const cleaned = cleanHtml(word);
    const consonantal = normalizeFinals(stripNikkud(cleaned));
    return {
      text: consonantal,
      textNiqqud: cleaned,
      lemma: "",
      morph: "",
      position: index,
    };
  });
}

/**
 * Fetch a chapter from Sefaria API v2.
 * Returns { hebrew: string[], english: string[] }
 */
async function fetchChapter(
  bookName: string,
  chapter: number
): Promise<{ hebrew: string[]; english: string[] } | null> {
  const ref = `${bookName}.${chapter}`;
  const url = `${SEFARIA_BASE}${encodeURIComponent(ref)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  FAILED ${ref}: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();

    // v2 API returns { he: string[], text: string[], ... }
    const hebrew: string[] = Array.isArray(data.he)
      ? data.he.map((v: string) => cleanHtml(String(v || "")))
      : [];
    const english: string[] = Array.isArray(data.text)
      ? data.text.map((v: string) => cleanHtml(String(v || "")))
      : [];

    return { hebrew, english };
  } catch (error) {
    console.error(`  ERROR ${ref}:`, error);
    return null;
  }
}

/**
 * Build data for a single book.
 */
async function buildBook(
  book: (typeof BOOKS)[0]
): Promise<{ verseCounts: number[] }> {
  console.log(`\n=== ${book.name} (${book.chapters} chapters) ===`);

  const chapters: Array<{
    book: string;
    bookHe: string;
    chapter: number;
    verses: VerseData[];
  }> = [];

  const verseCounts: number[] = [];

  for (let ch = 1; ch <= book.chapters; ch++) {
    process.stdout.write(`  Ch ${ch}/${book.chapters}...`);

    const chapterData = await fetchChapter(book.sefariaName, ch);

    if (!chapterData || chapterData.hebrew.length === 0) {
      console.log(" SKIPPED");
      chapters.push({ book: book.name, bookHe: book.nameHe, chapter: ch, verses: [] });
      verseCounts.push(0);
      await delay(300);
      continue;
    }

    const numVerses = chapterData.hebrew.length;
    verseCounts.push(numVerses);

    const verses: VerseData[] = [];
    for (let v = 0; v < numVerses; v++) {
      const hebrewText = chapterData.hebrew[v] || "";
      const englishText = chapterData.english[v] || "";

      verses.push({
        book: book.name,
        bookHe: book.nameHe,
        chapter: ch,
        verse: v + 1,
        text: stripNikkud(hebrewText),
        english: englishText,
        words: splitVerseIntoWords(hebrewText),
      });
    }

    chapters.push({ book: book.name, bookHe: book.nameHe, chapter: ch, verses });
    console.log(` ${numVerses} verses`);

    // Rate limit to be respectful to Sefaria
    await delay(400);
  }

  // Write book JSON
  const outputPath = path.join(DATA_DIR, `${book.slug}.json`);
  const bookData = {
    book: book.name,
    bookHe: book.nameHe,
    slug: book.slug,
    chapters,
  };

  fs.writeFileSync(outputPath, JSON.stringify(bookData), "utf-8");
  const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
  console.log(`  -> Wrote ${outputPath} (${fileSize} MB)`);

  return { verseCounts };
}

async function main() {
  console.log("=== Building Torah Data from Sefaria ===");
  console.log(`Started: ${new Date().toISOString()}\n`);

  fs.mkdirSync(DATA_DIR, { recursive: true });

  const booksMeta: Array<{
    name: string;
    nameHe: string;
    slug: string;
    chapters: number;
    verseCounts: number[];
  }> = [];

  for (const book of BOOKS) {
    const { verseCounts } = await buildBook(book);
    booksMeta.push({
      name: book.name,
      nameHe: book.nameHe,
      slug: book.slug,
      chapters: book.chapters,
      verseCounts,
    });
  }

  // Write books metadata
  const booksPath = path.join(DATA_DIR, "books.json");
  fs.writeFileSync(booksPath, JSON.stringify(booksMeta, null, 2), "utf-8");

  const totalVerses = booksMeta.reduce(
    (sum, b) => sum + b.verseCounts.reduce((s, v) => s + v, 0),
    0
  );

  console.log(`\n=== COMPLETE ===`);
  console.log(`Total verses: ${totalVerses}`);
  console.log(`Finished: ${new Date().toISOString()}`);
}

main().catch(console.error);
