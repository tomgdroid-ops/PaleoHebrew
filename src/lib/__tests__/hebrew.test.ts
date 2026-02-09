import { describe, it, expect } from "vitest";
import {
  stripNikkud,
  normalizeFinalForms,
  toConsonantal,
  toPaleoHebrew,
  splitToLetters,
  isHebrewLetter,
  calculateGematria,
  extractStrongsNumber,
  getPaleoChar,
} from "../hebrew";

describe("stripNikkud", () => {
  it("removes vowel points from Hebrew text", () => {
    // בְּרֵאשִׁית → בראשית
    expect(stripNikkud("בְּרֵאשִׁית")).toBe("בראשית");
  });

  it("leaves consonantal text unchanged", () => {
    expect(stripNikkud("אב")).toBe("אב");
  });

  it("handles empty string", () => {
    expect(stripNikkud("")).toBe("");
  });

  it("removes cantillation marks", () => {
    // Text with various cantillation marks
    expect(stripNikkud("בְּ֭רֵאשִׁ֑ית")).toBe("בראשית");
  });
});

describe("normalizeFinalForms", () => {
  it("converts final kaf to standard kaf", () => {
    expect(normalizeFinalForms("ך")).toBe("כ");
  });

  it("converts final mem to standard mem", () => {
    expect(normalizeFinalForms("שלום")).toBe("שלומ");
  });

  it("converts final nun to standard nun", () => {
    expect(normalizeFinalForms("ן")).toBe("נ");
  });

  it("converts final pey to standard pey", () => {
    expect(normalizeFinalForms("ף")).toBe("פ");
  });

  it("converts final tsade to standard tsade", () => {
    expect(normalizeFinalForms("ץ")).toBe("צ");
  });

  it("handles mixed text with finals and standard forms", () => {
    expect(normalizeFinalForms("אדם")).toBe("אדמ");
  });

  it("leaves text without finals unchanged", () => {
    expect(normalizeFinalForms("אב")).toBe("אב");
  });
});

describe("toConsonantal", () => {
  it("strips nikkud and normalizes finals", () => {
    expect(toConsonantal("שָׁלוֹם")).toBe("שלומ");
  });

  it("handles pointed text with final forms", () => {
    expect(toConsonantal("אָדָם")).toBe("אדמ");
  });
});

describe("toPaleoHebrew", () => {
  it("converts Aleph to Phoenician Aleph", () => {
    expect(toPaleoHebrew("א")).toBe("\u{10900}");
  });

  it("converts Bet to Phoenician Bet", () => {
    expect(toPaleoHebrew("ב")).toBe("\u{10901}");
  });

  it("converts Tav to Phoenician Tav", () => {
    expect(toPaleoHebrew("ת")).toBe("\u{10915}");
  });

  it("converts a full word", () => {
    // אב → 𐤀𐤁
    const result = toPaleoHebrew("אב");
    expect(result).toBe("\u{10900}\u{10901}");
  });

  it("handles final forms by normalizing first", () => {
    // שלום → שלומ (normalized) → Phoenician
    const result = toPaleoHebrew("שלום");
    expect(result).toBe("\u{10914}\u{1090B}\u{10905}\u{1090C}");
  });

  it("passes through non-Hebrew characters", () => {
    expect(toPaleoHebrew("א ב")).toContain(" ");
  });
});

describe("splitToLetters", () => {
  it("splits a simple two-letter word", () => {
    expect(splitToLetters("אב")).toEqual(["א", "ב"]);
  });

  it("splits a three-letter word", () => {
    expect(splitToLetters("ברא")).toEqual(["ב", "ר", "א"]);
  });

  it("normalizes final forms in the split", () => {
    // שלום → שלומ → [ש, ל, ו, מ]
    expect(splitToLetters("שלום")).toEqual(["ש", "ל", "ו", "מ"]);
  });

  it("handles pointed text by stripping nikkud first", () => {
    expect(splitToLetters("בְּרֵאשִׁית")).toEqual(["ב", "ר", "א", "ש", "י", "ת"]);
  });

  it("returns empty array for empty string", () => {
    expect(splitToLetters("")).toEqual([]);
  });

  it("filters out non-Hebrew characters", () => {
    expect(splitToLetters("א-ב")).toEqual(["א", "ב"]);
  });
});

describe("isHebrewLetter", () => {
  it("returns true for standard Hebrew letters", () => {
    expect(isHebrewLetter("א")).toBe(true);
    expect(isHebrewLetter("ת")).toBe(true);
    expect(isHebrewLetter("מ")).toBe(true);
  });

  it("returns true for final form letters", () => {
    expect(isHebrewLetter("ך")).toBe(true);
    expect(isHebrewLetter("ם")).toBe(true);
    expect(isHebrewLetter("ן")).toBe(true);
    expect(isHebrewLetter("ף")).toBe(true);
    expect(isHebrewLetter("ץ")).toBe(true);
  });

  it("returns false for non-Hebrew characters", () => {
    expect(isHebrewLetter("a")).toBe(false);
    expect(isHebrewLetter(" ")).toBe(false);
    expect(isHebrewLetter("1")).toBe(false);
  });
});

describe("calculateGematria", () => {
  it("calculates gematria for אב (father) = 3", () => {
    expect(calculateGematria("אב")).toBe(3); // 1 + 2
  });

  it("calculates gematria for אם (mother) = 41", () => {
    expect(calculateGematria("אם")).toBe(41); // 1 + 40
  });

  it("calculates gematria for שלום (peace) = 376", () => {
    // ש=300, ל=30, ו=6, מ=40 (final mem normalized)
    expect(calculateGematria("שלום")).toBe(376);
  });

  it("handles pointed text", () => {
    expect(calculateGematria("שָׁלוֹם")).toBe(376);
  });
});

describe("extractStrongsNumber", () => {
  it("handles simple number", () => {
    expect(extractStrongsNumber("430")).toBe("H0430");
  });

  it("handles prefix notation (b/7225)", () => {
    expect(extractStrongsNumber("b/7225")).toBe("H7225");
  });

  it("handles letter suffix (1254 a)", () => {
    expect(extractStrongsNumber("1254 a")).toBe("H1254");
  });

  it("handles multiple prefixes (c/d/8064)", () => {
    expect(extractStrongsNumber("c/d/8064")).toBe("H8064");
  });

  it("handles single prefix (c/853)", () => {
    expect(extractStrongsNumber("c/853")).toBe("H0853");
  });

  it("returns null for empty string", () => {
    expect(extractStrongsNumber("")).toBeNull();
  });

  it("returns null for invalid input", () => {
    expect(extractStrongsNumber("abc")).toBeNull();
  });
});

describe("getPaleoChar", () => {
  it("returns Paleo-Hebrew for standard letters", () => {
    expect(getPaleoChar("א")).toBe("\u{10900}");
    expect(getPaleoChar("ב")).toBe("\u{10901}");
  });

  it("returns Paleo-Hebrew for final forms", () => {
    expect(getPaleoChar("ך")).toBe("\u{1090A}"); // Same as כ
    expect(getPaleoChar("ם")).toBe("\u{1090C}"); // Same as מ
  });

  it("returns null for non-Hebrew characters", () => {
    expect(getPaleoChar("a")).toBeNull();
  });
});
