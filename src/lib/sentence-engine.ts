/**
 * Sentence Generation Engine v3 for The Aleph Tav Project.
 *
 * Takes root consonant letters, looks up their pictographic meanings,
 * and generates ranked interpretive sentences using clause-based templates.
 *
 * CURATED DATA is served FIRST. Algorithmic generation is a fallback.
 *
 * Scoring uses 4 factors (25pts each): primary meaning usage,
 * Strong's alignment, grammatical naturalness, and theological coherence.
 * Scoring is tuned for real differentiation (spread ~65 to ~95).
 */

import type {
  LetterMeaning,
  LetterMeaningEntry,
  LetterInterpretation,
  InterpretiveSentence,
  CuratedWordEntry,
} from "@/types";

// ============================================================
// Curated Sentence Conversion
// ============================================================

/**
 * Convert a curated word entry to InterpretiveSentence[].
 * This runs BEFORE any algorithmic generation.
 */
function convertCuratedSentences(
  curated: CuratedWordEntry,
  letterMeaningsMatrix: LetterMeaning[]
): InterpretiveSentence[] {
  const letterLookup = new Map<string, LetterMeaning>();
  for (const lm of letterMeaningsMatrix) {
    letterLookup.set(lm.letter, lm);
  }

  return curated.sentences.map((cs) => {
    const letterBreakdown: LetterInterpretation[] = cs.meanings_used.map((mu) => {
      const letterData = letterLookup.get(mu.letter);
      return {
        letter: mu.letter,
        name: letterData?.name || "",
        paleoUnicode: letterData?.paleoUnicode || "",
        pictograph: letterData?.pictograph || "",
        chosenMeaning: mu.meaning,
        role: letterData?.meanings.find((m) => m.text.toLowerCase() === mu.meaning.toLowerCase())?.role || "noun",
        allMeanings: letterData?.meanings || [],
      };
    });

    return {
      sentence: cs.sentence,
      score: cs.score,
      pattern: "CURATED",
      letterBreakdown,
      themes: cs.themes,
      curated: true,
    };
  });
}

// ============================================================
// Clause-Based Sentence Templates
// ============================================================

interface TemplateSlot {
  letterIndex: number;
  role: string;
}

interface Template {
  id: string;
  pattern: string;
  slots: TemplateSlot[];
  lengths: number[];
  clauseType: "simple" | "compound" | "complex"; // Used for scoring bonus
}

const TEMPLATES: Template[] = [
  // === 2-letter root templates ===
  { id: "2A", pattern: "The {0} of the {1}", clauseType: "simple",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }], lengths: [2] },
  { id: "2B", pattern: "The {0} within the {1}", clauseType: "simple",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }], lengths: [2] },
  { id: "2C", pattern: "The {0} who {1}", clauseType: "compound",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }], lengths: [2] },
  { id: "2D", pattern: "{0} the {1}", clauseType: "simple",
    slots: [{ letterIndex: 0, role: "verb" }, { letterIndex: 1, role: "noun" }], lengths: [2] },
  { id: "2E", pattern: "The {0} {1}", clauseType: "simple",
    slots: [{ letterIndex: 0, role: "adjective" }, { letterIndex: 1, role: "noun" }], lengths: [2] },
  { id: "2F", pattern: "The {0} — the {1} of the family", clauseType: "compound",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }], lengths: [2] },

  // === 3-letter root templates (subject + predicate clauses) ===
  { id: "3A", pattern: "The {0} of the {1} who {2}", clauseType: "compound",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }], lengths: [3] },
  { id: "3B", pattern: "The {0} {1} the {2}", clauseType: "compound",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }, { letterIndex: 2, role: "noun" }], lengths: [3] },
  { id: "3C", pattern: "The {0} {1}, revealed through the {2}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "adjective" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }], lengths: [3] },
  { id: "3D", pattern: "The {0} at the {1} — the {2} one who enters", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "adjective" }], lengths: [3] },
  { id: "3E", pattern: "The {0} of {1}, the one who {2}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }], lengths: [3] },
  { id: "3F", pattern: "The {0} who {1} through the {2}", clauseType: "compound",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }, { letterIndex: 2, role: "noun" }], lengths: [3] },

  // === 4-letter root templates (two linked clauses) ===
  { id: "4A", pattern: "The {0} of the {1}, {2} by the {3}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4B", pattern: "The {0} who {1} — behold, the {2} of the {3}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4C", pattern: "To {0} the {1}, {2} by the power of the {3}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "verb" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4D", pattern: "The {0} of {1}, who {2} the {3}", clauseType: "compound",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4E", pattern: "The {0} {1} who {2} with the {3}", clauseType: "compound",
    slots: [{ letterIndex: 0, role: "adjective" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }], lengths: [4] },

  // === 5-letter root templates (subject + pivot + result) ===
  { id: "5A", pattern: "The {0} who {1} — revealed through {2}, His {3} from the {4}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "noun" }, { letterIndex: 4, role: "noun" }], lengths: [5] },
  { id: "5B", pattern: "The {0} of the {1} who {2}, the {3} of the {4}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }, { letterIndex: 4, role: "noun" }], lengths: [5] },
  { id: "5C", pattern: "In the {0}, the {1} of {2} {3} with {4}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }], lengths: [5] },
  { id: "5D", pattern: "The {0} of {1}, the {2} who {3} the {4}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }], lengths: [5] },

  // === 6-letter root templates (full narrative) ===
  { id: "6A", pattern: "The {1} of the {0}, the {2} of God, {3} by His own {4} on a {5}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "noun" }], lengths: [6] },
  { id: "6B", pattern: "The {0} of the {1} {2}, {3} by the {4} of the {5}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "adjective" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "noun" }], lengths: [6] },
  { id: "6C", pattern: "In the {0}, the {1} who {2} — behold, the {3} of {4} made {5}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "adjective" }], lengths: [6] },
  { id: "6D", pattern: "The {0} of the {1} who {2}, {3} in {4}, sealed by a {5}", clauseType: "complex",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "adjective" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "noun" }], lengths: [6] },
];

// ============================================================
// Verb Conjugation
// ============================================================

function conjugateVerb(text: string): string {
  if (!text.startsWith("to ")) return text;
  const verb = text.slice(3);
  if (verb.endsWith("e")) return verb + "s";
  if (verb.endsWith("ch") || verb.endsWith("sh") || verb.endsWith("ss") || verb.endsWith("x") || verb.endsWith("o")) {
    return verb + "es";
  }
  if (verb.endsWith("y") && verb.length > 1 && !"aeiou".includes(verb[verb.length - 2])) {
    return verb.slice(0, -1) + "ies";
  }
  return verb + "s";
}

function bareVerb(text: string): string {
  return text.startsWith("to ") ? text.slice(3) : text;
}

function pastParticiple(text: string): string {
  const bare = bareVerb(text);
  if (bare.endsWith("e")) return bare + "d";
  if (bare.endsWith("y") && bare.length > 1 && !"aeiou".includes(bare[bare.length - 2])) {
    return bare.slice(0, -1) + "ied";
  }
  return bare + "ed";
}

// ============================================================
// Sentence Formatting
// ============================================================

function formatSentence(pattern: string, slotValues: { text: string; role: string }[]): string {
  let result = pattern;

  for (let i = 0; i < slotValues.length; i++) {
    const { text, role } = slotValues[i];
    const placeholder = `{${i}}`;
    const idx = result.indexOf(placeholder);
    if (idx === -1) continue;

    let formatted = text;

    if (role === "verb") {
      const before = result.substring(Math.max(0, idx - 15), idx).trim().toLowerCase();
      if (before.endsWith("will be") || before.endsWith("is") || before.endsWith("made")) {
        formatted = pastParticiple(text);
      } else if (before.endsWith("who") || before.endsWith("that") || before.endsWith("which")) {
        formatted = conjugateVerb(text);
      } else if (before.endsWith("to")) {
        formatted = bareVerb(text);
      } else if (idx === 0 || before === "" || before.endsWith(",") || before.endsWith("—")) {
        formatted = conjugateVerb(text);
      } else {
        formatted = conjugateVerb(text);
      }
    }

    result = result.replace(placeholder, formatted);
  }

  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// ============================================================
// Scoring Functions (4 factors, 25 points each = 100 total)
// Tuned for REAL DIFFERENTIATION: spread ~65 to ~95
// ============================================================

/**
 * Factor 1: Primary Meaning Usage (0-25)
 * Uses a steep curve: all-primary gets 25, each non-primary drops score sharply.
 */
function scorePrimaryUsage(meanings: LetterMeaningEntry[]): number {
  if (meanings.length === 0) return 0;
  const primaryCount = meanings.filter(m => m.primary).length;
  const ratio = primaryCount / meanings.length;

  // Steep curve: 100% primary = 25, 66% = 18, 50% = 13, 33% = 8, 0% = 2
  if (ratio === 1) return 25;
  if (ratio >= 0.75) return 20;
  if (ratio >= 0.5) return 14;
  if (ratio >= 0.25) return 8;
  return 2;
}

/**
 * Factor 2: Strong's Definition Alignment (0-25)
 * Matches keywords from Strong's definition with wider scoring spread.
 */
const SYNONYM_MAP: Record<string, string[]> = {
  "beginning": ["first", "head", "top", "chief", "start"],
  "create": ["make", "work", "form", "build"],
  "god": ["strength", "power", "mighty", "divine", "leader"],
  "father": ["house", "family", "leader", "strength"],
  "mother": ["water", "mighty", "strong", "bind"],
  "son": ["house", "seed", "offspring", "heir", "family"],
  "peace": ["complete", "whole", "secure", "rest"],
  "law": ["teach", "guide", "authority", "sign", "mark", "covenant"],
  "man": ["person", "head", "blood", "door"],
  "earth": ["land", "ground"],
  "heaven": ["sky"],
  "water": ["sea", "chaos", "mighty"],
  "light": ["reveal", "see", "fire"],
  "destroy": ["consume", "fire", "teeth"],
  "hand": ["work", "make", "deed"],
  "covenant": ["sign", "mark", "cross", "seal"],
  "first": ["beginning", "head", "chief", "top"],
  "chief": ["head", "first", "leader", "ruler"],
  "sacrifice": ["destroy", "cross", "blood"],
};

function scoreStrongsAlignment(meanings: LetterMeaningEntry[], strongsDef?: string): number {
  if (!strongsDef) return 10; // Lower neutral — no Strong's data penalizes slightly

  const defWords = strongsDef.toLowerCase().split(/[\s,;:()]+/).filter(w => w.length > 2);
  let exactMatches = 0;
  let thematicMatches = 0;

  for (const meaning of meanings) {
    const mWord = meaning.text.toLowerCase().replace(/^to /, "");

    // Exact match
    if (defWords.some(dw => dw.includes(mWord) || mWord.includes(dw))) {
      exactMatches++;
      continue;
    }

    // Thematic/synonym match
    let found = false;
    for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (defWords.some(dw => dw.includes(key) || key.includes(dw))) {
        if (synonyms.includes(mWord) || mWord === key) {
          thematicMatches++;
          found = true;
          break;
        }
      }
    }
    if (!found) {
      const synonyms = SYNONYM_MAP[mWord];
      if (synonyms) {
        if (defWords.some(dw => synonyms.some(s => dw.includes(s) || s.includes(dw)))) {
          thematicMatches++;
        }
      }
    }
  }

  // Wider spread: 0 matches = 0, each exact = 10pts, each thematic = 5pts
  return Math.min(25, (exactMatches * 10) + (thematicMatches * 5));
}

/**
 * Factor 3: Grammatical Naturalness (0-25)
 * Bonus for clause structure, penalty for flat chains.
 */
function scoreGrammaticalNaturalness(
  sentence: string,
  meanings: LetterMeaningEntry[],
  clauseType: "simple" | "compound" | "complex"
): number {
  let score = 15; // Start mid-range, not max

  // Clause type bonus
  if (clauseType === "complex") score += 6;
  else if (clauseType === "compound") score += 3;

  const words = sentence.toLowerCase().split(/\s+/);

  // Has verb = natural sentence (+3)
  const hasVerb = meanings.some(m => m.role === "verb");
  if (hasVerb) score += 3;

  // Penalty: three+ nouns in a row without a verb (flat chain)
  let consecutiveNouns = 0;
  for (const m of meanings) {
    if (m.role === "noun" || m.role === "adjective") {
      consecutiveNouns++;
      if (consecutiveNouns >= 3) { score -= 8; break; }
    } else {
      consecutiveNouns = 0;
    }
  }

  // Penalty: duplicate adjacent meaning text
  for (let i = 0; i < meanings.length - 1; i++) {
    if (meanings[i].text === meanings[i + 1].text) score -= 7;
  }

  // Penalty: excessive connector repetition
  const connectors = ["of", "the", "and", "by", "in", "with", "on"];
  for (const c of connectors) {
    const count = words.filter(w => w === c).length;
    if (count > 2) { score -= 4; break; }
  }

  // Penalty: sentence too short
  if (words.length < 4 && meanings.length >= 3) score -= 5;

  return Math.max(0, Math.min(25, score));
}

/**
 * Factor 4: Theological/Thematic Coherence (0-25)
 * Wider spread: needs 2+ theme matches for a good score.
 */
const THEMES: Record<string, string[]> = {
  creation: ["create", "make", "beginning", "first", "work", "complete", "form"],
  covenant: ["covenant", "sign", "mark", "seal", "promise", "oath", "cross"],
  redemption: ["save", "deliver", "cross", "sacrifice", "blood", "destroy", "consume"],
  family: ["father", "mother", "son", "house", "family", "seed", "offspring", "heir", "tent", "dwelling"],
  authority: ["leader", "chief", "head", "ruler", "king", "authority", "shepherd", "guide", "staff", "teach"],
  divine: ["god", "strength", "power", "spirit", "breath", "mighty", "fire"],
};

function scoreTheologicalCoherence(sentence: string, meanings: LetterMeaningEntry[]): number {
  const sentenceWords = sentence.toLowerCase().split(/[\s,;:.—]+/);
  const meaningTexts = meanings.map(m => m.text.toLowerCase().replace(/^to /, ""));
  const allWords = [...sentenceWords, ...meaningTexts];

  let matchedThemes = 0;
  let totalHits = 0;

  for (const [, keywords] of Object.entries(THEMES)) {
    let themeHits = 0;
    for (const kw of keywords) {
      if (allWords.some(w => w.includes(kw) || kw.includes(w))) {
        themeHits++;
        totalHits++;
      }
    }
    if (themeHits > 0) matchedThemes++;
  }

  // Wider spread: 0 themes = 2, 1 theme = 8, 2 themes = 14, 3+ = 20-25
  if (matchedThemes === 0) return 2;
  if (matchedThemes === 1) return Math.min(12, 6 + totalHits);
  if (matchedThemes === 2) return Math.min(20, 12 + totalHits);
  return Math.min(25, 16 + totalHits);
}

/**
 * Compute total score (0-100).
 */
function computeScore(
  meanings: LetterMeaningEntry[],
  sentence: string,
  clauseType: "simple" | "compound" | "complex",
  strongsDef?: string
): number {
  const f1 = scorePrimaryUsage(meanings);
  const f2 = scoreStrongsAlignment(meanings, strongsDef);
  const f3 = scoreGrammaticalNaturalness(sentence, meanings, clauseType);
  const f4 = scoreTheologicalCoherence(sentence, meanings);
  return f1 + f2 + f3 + f4;
}

// ============================================================
// Combination Generation
// ============================================================

function getMeaningsForSlot(letterMeaning: LetterMeaning, requiredRole: string): LetterMeaningEntry[] {
  if (requiredRole === "any") return letterMeaning.meanings;
  return letterMeaning.meanings.filter(m => m.role === requiredRole);
}

function* generateSlotCombinations(
  slotMeanings: LetterMeaningEntry[][]
): Generator<LetterMeaningEntry[]> {
  const lengths = slotMeanings.map(arr => arr.length);
  if (lengths.some(l => l === 0)) return;

  const total = lengths.reduce((a, b) => a * b, 1);
  const MAX = 3000;
  const limit = Math.min(total, MAX);

  const indices = new Array(slotMeanings.length).fill(0);
  for (let count = 0; count < limit; count++) {
    yield indices.map((idx, j) => slotMeanings[j][idx]);

    for (let j = indices.length - 1; j >= 0; j--) {
      indices[j]++;
      if (indices[j] < lengths[j]) break;
      indices[j] = 0;
    }
  }
}

// ============================================================
// Score Spread Enforcement
// ============================================================

/**
 * Enforce a minimum score gap between top and bottom results.
 * If the spread is too narrow, stretch scores proportionally.
 */
function enforceScoreSpread(sentences: InterpretiveSentence[], minGap: number = 15): InterpretiveSentence[] {
  if (sentences.length < 2) return sentences;

  const maxScore = sentences[0].score;
  const minScore = sentences[sentences.length - 1].score;
  const currentGap = maxScore - minScore;

  if (currentGap >= minGap) return sentences;

  // Stretch scores: top stays, bottom drops
  const targetMin = Math.max(45, maxScore - minGap);
  const targetMax = maxScore;

  return sentences.map((s, _i) => {
    if (currentGap === 0) {
      // All same score — assign linear spread
      const position = _i / Math.max(1, sentences.length - 1);
      const newScore = Math.round(targetMax - (position * (targetMax - targetMin)));
      return { ...s, score: newScore };
    }
    // Proportional stretch
    const normalizedPos = (maxScore - s.score) / currentGap;
    const newScore = Math.round(targetMax - (normalizedPos * (targetMax - targetMin)));
    return { ...s, score: newScore };
  });
}

// ============================================================
// Main API
// ============================================================

export interface GenerateOptions {
  maxResults?: number;
  strongsDefinition?: string;
  curatedData?: CuratedWordEntry;
}

/**
 * Generate ranked interpretive sentences from root consonant letters.
 * Curated data is served FIRST, then algorithmic sentences fill remaining slots.
 */
export function generateInterpretations(
  rootLetters: string[],
  letterMeaningsMatrix: LetterMeaning[],
  options: GenerateOptions = {}
): InterpretiveSentence[] {
  const { maxResults = 10, strongsDefinition, curatedData } = options;

  if (rootLetters.length === 0) return [];

  // === STEP 1: Curated sentences first ===
  const curatedResults: InterpretiveSentence[] = [];
  if (curatedData) {
    curatedResults.push(...convertCuratedSentences(curatedData, letterMeaningsMatrix));
  }

  // If curated covers all slots, return them directly
  if (curatedResults.length >= maxResults) {
    return curatedResults.slice(0, maxResults);
  }

  // === STEP 2: Algorithmic generation for remaining slots ===
  const algorithmicSlots = maxResults - curatedResults.length;

  // Build letter lookup
  const letterLookup = new Map<string, LetterMeaning>();
  for (const lm of letterMeaningsMatrix) {
    letterLookup.set(lm.letter, lm);
  }

  const letterData: LetterMeaning[] = [];
  for (const letter of rootLetters) {
    const data = letterLookup.get(letter);
    if (!data) continue;
    letterData.push(data);
  }

  if (letterData.length === 0) return curatedResults;

  const rootLen = letterData.length;

  // Get applicable templates
  let templates = TEMPLATES.filter(t => t.lengths.includes(rootLen));

  if (templates.length === 0) {
    const slots: TemplateSlot[] = letterData.map((_, i) => ({ letterIndex: i, role: "noun" }));
    const pattern = slots.map((_, i) => i === 0 ? "The {0}" : `of the {${i}}`).join(" ");
    templates = [{ id: "FALLBACK", pattern, slots, lengths: [rootLen], clauseType: "simple" }];
  }

  // Deduplicate against curated sentences
  const seenSentences = new Set<string>();
  for (const cs of curatedResults) {
    seenSentences.add(cs.sentence.toLowerCase());
  }

  // Generate candidates per template
  const perTemplate = new Map<string, InterpretiveSentence[]>();

  for (const template of templates) {
    const slotMeanings = template.slots.map(slot =>
      getMeaningsForSlot(letterData[slot.letterIndex], slot.role)
    );

    const templateCandidates: InterpretiveSentence[] = [];

    for (const combo of generateSlotCombinations(slotMeanings)) {
      const slotValues = combo.map((m, i) => ({ text: m.text, role: template.slots[i].role }));
      const sentence = formatSentence(template.pattern, slotValues);

      const key = sentence.toLowerCase();
      if (seenSentences.has(key)) continue;
      seenSentences.add(key);

      // Skip adjacent duplicate meanings
      let hasDup = false;
      for (let i = 0; i < combo.length - 1; i++) {
        if (combo[i].text === combo[i + 1].text) { hasDup = true; break; }
      }
      if (hasDup) continue;

      const score = computeScore(combo, sentence, template.clauseType, strongsDefinition);

      const letterBreakdown: LetterInterpretation[] = template.slots.map((slot, i) => ({
        letter: letterData[slot.letterIndex].letter,
        name: letterData[slot.letterIndex].name,
        paleoUnicode: letterData[slot.letterIndex].paleoUnicode,
        pictograph: letterData[slot.letterIndex].pictograph,
        chosenMeaning: combo[i].text,
        role: combo[i].role,
        allMeanings: letterData[slot.letterIndex].meanings,
      }));

      templateCandidates.push({
        sentence,
        score,
        pattern: template.id,
        letterBreakdown,
      });
    }

    templateCandidates.sort((a, b) => b.score - a.score);
    if (templateCandidates.length > 0) {
      perTemplate.set(template.id, templateCandidates);
    }
  }

  // Interleave: best from each template in round-robin, max 2 per template
  const algorithmic: InterpretiveSentence[] = [];
  const templateIds = [...perTemplate.keys()];
  const pointers = new Map<string, number>();
  for (const id of templateIds) pointers.set(id, 0);

  while (algorithmic.length < algorithmicSlots * 2) {
    let added = false;
    for (const id of templateIds) {
      const candidates = perTemplate.get(id)!;
      const ptr = pointers.get(id)!;
      if (ptr < candidates.length && ptr < 2) {
        algorithmic.push(candidates[ptr]);
        pointers.set(id, ptr + 1);
        added = true;
      }
    }
    if (!added) break;
  }

  // Sort algorithmic by score
  algorithmic.sort((a, b) => b.score - a.score);

  // Enforce score spread on algorithmic results
  const spreadAlgorithmic = enforceScoreSpread(algorithmic.slice(0, algorithmicSlots));

  // Combine: curated first, then algorithmic
  return [...curatedResults, ...spreadAlgorithmic].slice(0, maxResults);
}

/**
 * Get letter details for display (without generating sentences).
 */
export function getLetterDetails(
  rootLetters: string[],
  letterMeaningsMatrix: LetterMeaning[]
): LetterInterpretation[] {
  const letterLookup = new Map<string, LetterMeaning>();
  for (const lm of letterMeaningsMatrix) {
    letterLookup.set(lm.letter, lm);
  }

  const results: LetterInterpretation[] = [];
  for (const letter of rootLetters) {
    const data = letterLookup.get(letter);
    if (!data) continue;
    results.push({
      letter: data.letter,
      name: data.name,
      paleoUnicode: data.paleoUnicode,
      pictograph: data.pictograph,
      chosenMeaning: data.meanings[0]?.text || "",
      role: data.meanings[0]?.role || "",
      allMeanings: data.meanings,
    });
  }
  return results;
}
