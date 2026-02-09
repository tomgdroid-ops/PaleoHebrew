/**
 * Hebrew text utility functions for the Paleo-Hebrew Torah Decoder.
 * Handles nikkud stripping, final form normalization, and Paleo-Hebrew mapping.
 */

// Modern Hebrew to Phoenician Unicode mapping
const MODERN_TO_PALEO: Record<string, string> = {
  "א": "\u{10900}",
  "ב": "\u{10901}",
  "ג": "\u{10902}",
  "ד": "\u{10903}",
  "ה": "\u{10904}",
  "ו": "\u{10905}",
  "ז": "\u{10906}",
  "ח": "\u{10907}",
  "ט": "\u{10908}",
  "י": "\u{10909}",
  "כ": "\u{1090A}",
  "ל": "\u{1090B}",
  "מ": "\u{1090C}",
  "נ": "\u{1090D}",
  "ס": "\u{1090E}",
  "ע": "\u{1090F}",
  "פ": "\u{10910}",
  "צ": "\u{10911}",
  "ק": "\u{10912}",
  "ר": "\u{10913}",
  "ש": "\u{10914}",
  "ת": "\u{10915}",
};

// Final form to standard form mapping
const FINAL_TO_STANDARD: Record<string, string> = {
  "ך": "כ",
  "ם": "מ",
  "ן": "נ",
  "ף": "פ",
  "ץ": "צ",
};

// All Hebrew consonants (standard forms only)
const HEBREW_CONSONANTS = new Set(Object.keys(MODERN_TO_PALEO));

// All Hebrew consonants including final forms
const ALL_HEBREW_LETTERS = new Set([
  ...Object.keys(MODERN_TO_PALEO),
  ...Object.keys(FINAL_TO_STANDARD),
]);

/**
 * Remove nikkud (vowel points and cantillation marks) from Hebrew text.
 * Strips Unicode range U+0591-U+05C7.
 */
export function stripNikkud(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, "");
}

/**
 * Normalize final letter forms to their standard equivalents.
 * ך→כ, ם→מ, ן→נ, ף→פ, ץ→צ
 */
export function normalizeFinalForms(text: string): string {
  return [...text].map((ch) => FINAL_TO_STANDARD[ch] || ch).join("");
}

/**
 * Convert Hebrew text to consonantal form (strip nikkud + normalize finals).
 */
export function toConsonantal(text: string): string {
  return normalizeFinalForms(stripNikkud(text));
}

/**
 * Convert modern Hebrew text to Paleo-Hebrew (Phoenician Unicode block).
 * Non-Hebrew characters are passed through unchanged.
 */
export function toPaleoHebrew(modernHebrew: string): string {
  const consonantal = toConsonantal(modernHebrew);
  return [...consonantal]
    .map((ch) => MODERN_TO_PALEO[ch] || ch)
    .join("");
}

/**
 * Split a Hebrew word into individual consonant letters.
 * Strips nikkud and normalizes final forms first.
 * Returns only Hebrew consonant characters.
 */
export function splitToLetters(text: string): string[] {
  const consonantal = toConsonantal(text);
  return [...consonantal].filter((ch) => HEBREW_CONSONANTS.has(ch));
}

/**
 * Check if a character is a Hebrew letter (including final forms).
 */
export function isHebrewLetter(char: string): boolean {
  return ALL_HEBREW_LETTERS.has(char);
}

/**
 * Check if a character is a Hebrew consonant in standard form.
 */
export function isHebrewConsonant(char: string): boolean {
  return HEBREW_CONSONANTS.has(char);
}

/**
 * Get the Paleo-Hebrew Unicode character for a modern Hebrew letter.
 * Handles final forms by normalizing first.
 */
export function getPaleoChar(modernLetter: string): string | null {
  const normalized = FINAL_TO_STANDARD[modernLetter] || modernLetter;
  return MODERN_TO_PALEO[normalized] || null;
}

/**
 * Calculate the gematria value of a Hebrew word.
 */
const GEMATRIA_VALUES: Record<string, number> = {
  "א": 1, "ב": 2, "ג": 3, "ד": 4, "ה": 5,
  "ו": 6, "ז": 7, "ח": 8, "ט": 9, "י": 10,
  "כ": 20, "ל": 30, "מ": 40, "נ": 50, "ס": 60,
  "ע": 70, "פ": 80, "צ": 90, "ק": 100, "ר": 200,
  "ש": 300, "ת": 400,
};

export function calculateGematria(text: string): number {
  const letters = splitToLetters(text);
  return letters.reduce((sum, letter) => sum + (GEMATRIA_VALUES[letter] || 0), 0);
}

/**
 * Extract a Strong's number from an OSHB lemma attribute.
 * Handles formats: "b/7225", "1254 a", "c/d/8064", "430"
 */
export function extractStrongsNumber(lemma: string): string | null {
  if (!lemma || lemma.trim() === "") return null;

  // Split by "/" and take the last segment (strips prefix markers)
  const parts = lemma.split("/");
  const lastPart = parts[parts.length - 1].trim();

  // Remove trailing letter suffix (e.g., "1254 a" -> "1254")
  const numStr = lastPart.replace(/\s*[a-z]$/i, "").trim();

  // Parse as number
  const num = parseInt(numStr, 10);
  if (isNaN(num) || num <= 0) return null;

  // Pad to 4 digits and prefix with H
  return `H${String(num).padStart(4, "0")}`;
}

// Common Hebrew prefixes (for basic root extraction when OSHB data unavailable)
export const COMMON_PREFIXES = ["ב", "כ", "ל", "מ", "ש", "ה", "ו"];

// Common Hebrew suffixes
export const COMMON_SUFFIXES = ["ים", "ות", "ה", "י", "ך", "ו", "ם", "ן"];
