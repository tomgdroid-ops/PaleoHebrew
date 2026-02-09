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

/**
 * Transliterate a Hebrew word into English characters.
 * Uses a simplified academic transliteration scheme.
 */
const TRANSLITERATION: Record<string, string> = {
  "א": "'",  "ב": "b",  "ג": "g",  "ד": "d",  "ה": "h",
  "ו": "v",  "ז": "z",  "ח": "ch", "ט": "t",  "י": "y",
  "כ": "k",  "ל": "l",  "מ": "m",  "נ": "n",  "ס": "s",
  "ע": "'",  "פ": "p",  "צ": "ts", "ק": "q",  "ר": "r",
  "ש": "sh", "ת": "t",
  // Final forms
  "ך": "k",  "ם": "m",  "ן": "n",  "ף": "p",  "ץ": "ts",
};

// Common nikkud to vowel mappings
const VOWEL_MAP: Record<number, string> = {
  0x05B0: "e",   // shva
  0x05B1: "e",   // hataf segol
  0x05B2: "a",   // hataf patach
  0x05B3: "o",   // hataf qamats
  0x05B4: "i",   // hiriq
  0x05B5: "e",   // tsere
  0x05B6: "e",   // segol
  0x05B7: "a",   // patach
  0x05B8: "a",   // qamats
  0x05B9: "o",   // holam
  0x05BA: "o",   // holam haser
  0x05BB: "u",   // qubuts
  0x05BC: "",    // dagesh (not a vowel, skip)
  0x05C1: "",    // shin dot
  0x05C2: "",    // sin dot
};

export function transliterate(hebrewText: string): string {
  // First pass: build an array of { type, value } tokens
  const chars = [...hebrewText];
  const tokens: { type: "consonant" | "vowel" | "skip" | "other"; value: string }[] = [];

  for (const ch of chars) {
    const code = ch.codePointAt(0) || 0;

    // Cantillation marks — skip entirely
    if (code >= 0x0591 && code <= 0x05AF) continue;

    // Shin dot (05C1) — skip (shin is already "sh" by default)
    if (code === 0x05C1) continue;

    // Sin dot (05C2) — change most recent shin "sh" to "s"
    if (code === 0x05C2) {
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].type === "consonant" && tokens[j].value === "sh") {
          tokens[j].value = "s";
          break;
        }
      }
      continue;
    }

    // Dagesh (05BC): when on vav, it's shuruk (vowel "u"); otherwise skip
    if (code === 0x05BC) {
      // Check if previous token is vav consonant
      const prevTok = tokens.length > 0 ? tokens[tokens.length - 1] : null;
      if (prevTok && prevTok.type === "consonant" && prevTok.value === "v") {
        // Convert the vav to a vowel "u" (shuruk)
        prevTok.type = "vowel";
        prevTok.value = "u";
      }
      continue;
    }

    // Vowel points
    if (code >= 0x05B0 && code <= 0x05BB) {
      const vowel = VOWEL_MAP[code];
      if (vowel) tokens.push({ type: "vowel", value: vowel });
      continue;
    }

    // Hebrew consonants
    const translit = TRANSLITERATION[ch];
    if (translit !== undefined) {
      tokens.push({ type: "consonant", value: translit });
      continue;
    }

    // Maqaf
    if (ch === "\u05BE") { tokens.push({ type: "other", value: "-" }); continue; }
    if (ch === " ") { tokens.push({ type: "other", value: " " }); continue; }
  }

  // Second pass: build result, handling matres lectionis (vowel letters)
  let result = "";
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    if (tok.type === "consonant") {
      const isAlephAyin = tok.value === "'";

      // Check if next token is a vowel
      const nextIsVowel = i + 1 < tokens.length && tokens[i + 1].type === "vowel";
      // Check what the last character in result is
      const lastChar = result.length > 0 ? result[result.length - 1] : "";
      const prevIsResultVowel = lastChar !== "" && "aeiou".includes(lastChar);
      const prevIsResultConsonant = lastChar !== "" && !"aeiou -".includes(lastChar);

      if (isAlephAyin) {
        // Skip aleph/ayin glyph — just let its vowel appear
        continue;
      }

      // Vav as vowel letter (mater lectionis):
      // וֹ = holam male (o), וּ = shuruk (u)
      if (tok.value === "v" && nextIsVowel) {
        const nextVowel = tokens[i + 1].value;
        if (nextVowel === "o" || nextVowel === "u") {
          result += nextVowel;
          i++; // skip the vowel token
          continue;
        }
      }

      // Yod as vowel letter (hiriq male):
      // יִ after a vowel = just extends to "i", not "yi"
      if (tok.value === "y" && nextIsVowel && tokens[i + 1].value === "i") {
        if (prevIsResultVowel) {
          result += "i";
          i++; // skip vowel
          continue;
        }
      }

      result += tok.value;
    } else if (tok.type === "vowel") {
      result += tok.value;
    } else if (tok.type === "other") {
      result += tok.value;
    }
  }

  // Clean up
  result = result.replace(/iy(?=[mt]|$)/g, "i");   // -iyt → -it, -iym → -im, -iy$ → -i
  result = result.replace(/([aeiou])\1+/g, "$1");  // collapse repeated vowels
  result = result.replace(/(ch|h)a$/, "a$1");      // furtive patach: -cha → -ach, -ha → -ah
  result = result.replace(/eh$/, "e");              // trailing silent heh: -eh → -e

  return result;
}

// Common Hebrew prefixes (for basic root extraction when OSHB data unavailable)
export const COMMON_PREFIXES = ["ב", "כ", "ל", "מ", "ש", "ה", "ו"];

// Common Hebrew suffixes
export const COMMON_SUFFIXES = ["ים", "ות", "ה", "י", "ך", "ו", "ם", "ן"];
