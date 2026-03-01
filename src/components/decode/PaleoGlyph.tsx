"use client";

// Map Hebrew letters to Paleo Unicode characters (Phoenician block U+10900-U+1091F)
const HEBREW_TO_PALEO: Record<string, string> = {
  "א": "\u{10900}", "ב": "\u{10901}", "ג": "\u{10902}", "ד": "\u{10903}",
  "ה": "\u{10904}", "ו": "\u{10905}", "ז": "\u{10906}", "ח": "\u{10907}",
  "ט": "\u{10908}", "י": "\u{10909}", "כ": "\u{1090A}", "ל": "\u{1090B}",
  "מ": "\u{1090C}", "נ": "\u{1090D}", "ס": "\u{1090E}", "ע": "\u{1090F}",
  "פ": "\u{10910}", "צ": "\u{10911}", "ק": "\u{10912}", "ר": "\u{10913}",
  "ש": "\u{10914}", "ת": "\u{10915}",
  // Final forms map to same Paleo character
  "ך": "\u{1090A}", "ם": "\u{1090C}", "ן": "\u{1090D}", "ף": "\u{10910}", "ץ": "\u{10911}",
};

// Map Paleo Unicode to Hebrew letter
const PALEO_TO_HEBREW: Record<string, string> = {
  "\u{10900}": "א", "\u{10901}": "ב", "\u{10902}": "ג", "\u{10903}": "ד",
  "\u{10904}": "ה", "\u{10905}": "ו", "\u{10906}": "ז", "\u{10907}": "ח",
  "\u{10908}": "ט", "\u{10909}": "י", "\u{1090A}": "כ", "\u{1090B}": "ל",
  "\u{1090C}": "מ", "\u{1090D}": "נ", "\u{1090E}": "ס", "\u{1090F}": "ע",
  "\u{10910}": "פ", "\u{10911}": "צ", "\u{10912}": "ק", "\u{10913}": "ר",
  "\u{10914}": "ש", "\u{10915}": "ת",
};

interface PaleoGlyphProps {
  paleoChar: string;
  letterName: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: 24,
  md: 36,
  lg: 48,
  xl: 64,
};

export function getSvgNameForLetter(letter: string): string | undefined {
  if (HEBREW_TO_PALEO[letter]) return letter;
  const hebrew = PALEO_TO_HEBREW[letter];
  if (hebrew) return hebrew;
  return undefined;
}

export default function PaleoGlyph({
  paleoChar,
  letterName,
  size = "md",
  className = "",
}: PaleoGlyphProps) {
  const px = SIZE_MAP[size];

  // If it's already a Paleo Unicode char, use it directly.
  // If it's a Hebrew letter, convert to Paleo Unicode.
  const displayChar = PALEO_TO_HEBREW[paleoChar]
    ? paleoChar
    : HEBREW_TO_PALEO[paleoChar] || paleoChar;

  return (
    <span
      className={`paleo-glyph text-primary inline-block ${className}`}
      style={{ fontSize: px }}
      aria-label={`Paleo-Hebrew letter ${letterName}`}
      title={letterName}
      role="img"
    >
      {displayChar}
    </span>
  );
}

/**
 * Render Paleo-Hebrew glyphs for a Hebrew word using NotoSansPhoenician font.
 * Converts modern Hebrew consonants to Paleo Unicode characters.
 */
export function PaleoWordGlyphs({
  hebrewWord,
  size = "sm",
}: {
  hebrewWord: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const px = SIZE_MAP[size];

  // Strip nikkud/cantillation, convert each consonant to Paleo Unicode
  const paleoText = [...hebrewWord.replace(/[\u0591-\u05C7]/g, "")]
    .map((ch) => HEBREW_TO_PALEO[ch] || "")
    .join("");

  return (
    <span
      className="paleo-glyph text-primary interlinear-paleo"
      style={{ fontSize: px }}
      dir="rtl"
    >
      {paleoText}
    </span>
  );
}
