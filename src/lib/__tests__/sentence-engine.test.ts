import { describe, it, expect } from "vitest";
import { generateInterpretations, getLetterDetails } from "../sentence-engine";
import type { LetterMeaning } from "@/types";
import letterMeaningsData from "../../../data/letter-meanings.json";

const letterMeanings = letterMeaningsData as LetterMeaning[];

describe("generateInterpretations", () => {
  it("generates sentences for אב (father) - 2 letter root", () => {
    const results = generateInterpretations(["א", "ב"], letterMeanings, {
      maxResults: 10,
      strongsDefinition: "father",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(10);

    // Check that results are sorted by score descending
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }

    // Check structure of first result
    const top = results[0];
    expect(top.sentence).toBeTruthy();
    expect(top.score).toBeGreaterThan(0);
    expect(top.letterBreakdown).toHaveLength(2);
    expect(top.letterBreakdown[0].letter).toBe("א");
    expect(top.letterBreakdown[1].letter).toBe("ב");

    // The top results should contain strength/leader + house/family themes
    const allSentences = results.map((r) => r.sentence.toLowerCase());
    const hasStrengthHouse = allSentences.some(
      (s) =>
        (s.includes("strength") || s.includes("leader") || s.includes("power")) &&
        (s.includes("house") || s.includes("family") || s.includes("tent"))
    );
    expect(hasStrengthHouse).toBe(true);
  });

  it("generates sentences for אם (mother) - 2 letter root", () => {
    const results = generateInterpretations(["א", "מ"], letterMeanings, {
      maxResults: 10,
      strongsDefinition: "mother",
    });

    expect(results.length).toBeGreaterThan(0);

    // Should have strength/ox + water/chaos themes
    const allSentences = results.map((r) => r.sentence.toLowerCase());
    const hasTheme = allSentences.some(
      (s) =>
        (s.includes("strength") || s.includes("power") || s.includes("leader")) &&
        (s.includes("water") || s.includes("sea") || s.includes("mighty") || s.includes("chaos"))
    );
    expect(hasTheme).toBe(true);
  });

  it("generates sentences for בן (son) - 2 letter root", () => {
    const results = generateInterpretations(["ב", "נ"], letterMeanings, {
      maxResults: 10,
      strongsDefinition: "son",
    });

    expect(results.length).toBeGreaterThan(0);

    // Should have house + seed/offspring themes
    const allSentences = results.map((r) => r.sentence.toLowerCase());
    const hasTheme = allSentences.some(
      (s) =>
        (s.includes("house") || s.includes("family") || s.includes("tent")) &&
        (s.includes("seed") || s.includes("offspring") || s.includes("heir"))
    );
    expect(hasTheme).toBe(true);
  });

  it("generates sentences for ברא (create) - 3 letter root", () => {
    const results = generateInterpretations(["ב", "ר", "א"], letterMeanings, {
      maxResults: 10,
      strongsDefinition: "to create, shape, form",
    });

    expect(results.length).toBeGreaterThan(0);

    // Check 3-letter breakdown
    const top = results[0];
    expect(top.letterBreakdown).toHaveLength(3);
    expect(top.letterBreakdown[0].letter).toBe("ב");
    expect(top.letterBreakdown[1].letter).toBe("ר");
    expect(top.letterBreakdown[2].letter).toBe("א");
  });

  it("generates sentences for תורה (torah) - 4 letter root", () => {
    const results = generateInterpretations(
      ["ת", "ו", "ר", "ה"],
      letterMeanings,
      {
        maxResults: 10,
        strongsDefinition: "instruction, law, teaching",
      }
    );

    expect(results.length).toBeGreaterThan(0);

    const top = results[0];
    expect(top.letterBreakdown).toHaveLength(4);

    // Should have sign/mark + peg/secure + head/beginning + behold/reveal themes
    const allSentences = results.map((r) => r.sentence.toLowerCase());
    const hasRelevantContent = allSentences.some(
      (s) =>
        s.includes("sign") ||
        s.includes("mark") ||
        s.includes("covenant") ||
        s.includes("head") ||
        s.includes("reveal")
    );
    expect(hasRelevantContent).toBe(true);
  });

  it("generates sentences for שלם (root of shalom) - 3 letter root", () => {
    const results = generateInterpretations(["ש", "ל", "מ"], letterMeanings, {
      maxResults: 10,
      strongsDefinition: "peace, completeness, welfare",
    });

    expect(results.length).toBeGreaterThan(0);

    // Shin + Lamed + Mem = teeth/fire + staff/teach + water
    const top = results[0];
    expect(top.letterBreakdown).toHaveLength(3);
  });

  it("returns empty array for empty input", () => {
    const results = generateInterpretations([], letterMeanings);
    expect(results).toEqual([]);
  });

  it("returns empty array for unknown letters", () => {
    const results = generateInterpretations(["X", "Y"], letterMeanings);
    expect(results).toEqual([]);
  });

  it("handles single letter input", () => {
    // Single letters won't match any template, but should not crash
    const results = generateInterpretations(["א"], letterMeanings);
    // May return empty or a fallback — just shouldn't throw
    expect(Array.isArray(results)).toBe(true);
  });

  it("does not produce duplicate sentences", () => {
    const results = generateInterpretations(["א", "ב"], letterMeanings, {
      maxResults: 50,
    });

    const sentences = results.map((r) => r.sentence.toLowerCase());
    const unique = new Set(sentences);
    expect(sentences.length).toBe(unique.size);
  });

  it("does not produce sentences with duplicate adjacent meanings", () => {
    const results = generateInterpretations(["א", "ב"], letterMeanings, {
      maxResults: 50,
    });

    for (const result of results) {
      for (let i = 0; i < result.letterBreakdown.length - 1; i++) {
        expect(result.letterBreakdown[i].chosenMeaning).not.toBe(
          result.letterBreakdown[i + 1].chosenMeaning
        );
      }
    }
  });

  it("scores results between 0 and 100", () => {
    const results = generateInterpretations(["ב", "ר", "א"], letterMeanings, {
      maxResults: 20,
    });

    for (const result of results) {
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });

  it("includes pattern ID in each result", () => {
    const results = generateInterpretations(["א", "ב"], letterMeanings, {
      maxResults: 5,
    });

    for (const result of results) {
      expect(result.pattern).toBeTruthy();
      expect(typeof result.pattern).toBe("string");
    }
  });
});

describe("getLetterDetails", () => {
  it("returns details for all letters in a word", () => {
    const details = getLetterDetails(["א", "ב"], letterMeanings);
    expect(details).toHaveLength(2);

    expect(details[0].letter).toBe("א");
    expect(details[0].name).toBe("Aleph");
    expect(details[0].pictograph).toBe("Ox head");
    expect(details[0].paleoUnicode).toBeTruthy();
    expect(details[0].allMeanings.length).toBeGreaterThan(0);

    expect(details[1].letter).toBe("ב");
    expect(details[1].name).toBe("Bet");
  });

  it("skips unknown letters", () => {
    const details = getLetterDetails(["א", "X", "ב"], letterMeanings);
    expect(details).toHaveLength(2);
  });

  it("returns empty array for no valid letters", () => {
    const details = getLetterDetails(["X", "Y"], letterMeanings);
    expect(details).toEqual([]);
  });
});
