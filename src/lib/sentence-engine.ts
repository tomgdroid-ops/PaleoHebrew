/**
 * Sentence Generation Engine v2 for the Paleo-Hebrew Torah Decoder.
 *
 * Takes root consonant letters, looks up their pictographic meanings,
 * and generates ranked interpretive sentences using clause-based templates.
 * Scoring is based on 4 factors (25pts each): primary meaning usage,
 * Strong's alignment, grammatical naturalness, and theological coherence.
 */

import type {
  LetterMeaning,
  LetterMeaningEntry,
  LetterInterpretation,
  InterpretiveSentence,
} from "@/types";

// ============================================================
// Clause-Based Sentence Templates
// ============================================================

/**
 * Each template slot is typed: {index:role}
 * The engine only fills a slot with a meaning whose grammatical role matches.
 * Templates are organized by root length and grouped by clause structure.
 */

interface TemplateSlot {
  letterIndex: number;  // Which root letter (0-based)
  role: string;         // Required role: "noun", "verb", "adjective", or "any"
}

interface Template {
  id: string;
  pattern: string;        // Human-readable pattern with {0}, {1}, etc. placeholders
  slots: TemplateSlot[];  // Slot definitions with role constraints
  lengths: number[];      // Which root lengths this applies to
}

const TEMPLATES: Template[] = [
  // === 2-letter root templates ===
  { id: "2A", pattern: "The {0} of the {1}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }], lengths: [2] },
  { id: "2B", pattern: "The {0} within the {1}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }], lengths: [2] },
  { id: "2C", pattern: "The {0} who {1}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }], lengths: [2] },
  { id: "2D", pattern: "{0} the {1}",
    slots: [{ letterIndex: 0, role: "verb" }, { letterIndex: 1, role: "noun" }], lengths: [2] },
  { id: "2E", pattern: "The {0} {1}",
    slots: [{ letterIndex: 0, role: "adjective" }, { letterIndex: 1, role: "noun" }], lengths: [2] },

  // === 3-letter root templates (subject + predicate) ===
  { id: "3A", pattern: "The {0} of the {1} {2}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }], lengths: [3] },
  { id: "3B", pattern: "The {0} {1} the {2}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }, { letterIndex: 2, role: "noun" }], lengths: [3] },
  { id: "3C", pattern: "The {0} {1} of {2}",
    slots: [{ letterIndex: 0, role: "adjective" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }], lengths: [3] },
  { id: "3D", pattern: "{0} of the {1} is {2}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "adjective" }], lengths: [3] },
  { id: "3E", pattern: "The {0} of the {1} and the {2}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }], lengths: [3] },

  // === 4-letter root templates (two linked clauses) ===
  { id: "4A", pattern: "The {0} of the {1} is {2} by the {3}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4B", pattern: "The {0} {1} and {2} the {3}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4C", pattern: "The {0} of {1}, {2} by the {3}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4D", pattern: "The {0} {1} {2} the {3}",
    slots: [{ letterIndex: 0, role: "adjective" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4E", pattern: "The {0} that {1} the {2} of the {3}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4F", pattern: "The {0} of the {1}, the {2} of {3}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "noun" }], lengths: [4] },
  { id: "4G", pattern: "The {0} {1} the {2} who {3}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "verb" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }], lengths: [4] },

  // === 5-letter root templates (subject + pivot + result) ===
  { id: "5A", pattern: "The {0} of the {1} who {2} will be {3} by {4}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }], lengths: [5] },
  { id: "5B", pattern: "The {0} of the {1} {2} {3} the {4}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "adjective" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }], lengths: [5] },
  { id: "5C", pattern: "In the {0}, the {1} of {2} {3} with {4}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }], lengths: [5] },

  // === 6-letter root templates (full narrative) ===
  { id: "6A", pattern: "The {1} of the {0}, the {2} of God, will be {3} by His own {4} on a {5}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "noun" }], lengths: [6] },
  { id: "6B", pattern: "The {0} of the {1} {2} will be {3} by the {4} of the {5}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "adjective" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "noun" }], lengths: [6] },
  { id: "6C", pattern: "Inside the {1}, the {2} {3} {4} to {5}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "verb" }], lengths: [6] },
  { id: "6D", pattern: "The {0} of the {1} who {2} is {3} in {4}, sealed by a {5}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "noun" }, { letterIndex: 2, role: "verb" }, { letterIndex: 3, role: "adjective" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "noun" }], lengths: [6] },
  { id: "6E", pattern: "The {0} of the {1} {2} {3} the {4} of {5}",
    slots: [{ letterIndex: 0, role: "noun" }, { letterIndex: 1, role: "adjective" }, { letterIndex: 2, role: "noun" }, { letterIndex: 3, role: "verb" }, { letterIndex: 4, role: "noun" }, { letterIndex: 5, role: "noun" }], lengths: [6] },
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
  // Simple: just add "ed"
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
      if (before.endsWith("will be") || before.endsWith("is")) {
        formatted = pastParticiple(text);
      } else if (before.endsWith("who") || before.endsWith("that") || before.endsWith("which")) {
        formatted = conjugateVerb(text);
      } else if (before.endsWith("to")) {
        formatted = bareVerb(text);
      } else if (idx === 0 || before === "" || before.endsWith(",")) {
        // Start of sentence or after comma: use conjugated
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
// ============================================================

/**
 * Factor 1: Primary Meaning Usage (0-25)
 * All primary = 25, proportional.
 */
function scorePrimaryUsage(meanings: LetterMeaningEntry[]): number {
  if (meanings.length === 0) return 0;
  const primaryCount = meanings.filter(m => m.primary).length;
  return Math.round((primaryCount / meanings.length) * 25);
}

/**
 * Factor 2: Strong's Definition Alignment (0-25)
 * Matches keywords from Strong's definition.
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
  if (!strongsDef) return 12; // Neutral

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
      // Check reverse: is the meaning a key in SYNONYM_MAP, and does the def contain a synonym?
      const synonyms = SYNONYM_MAP[mWord];
      if (synonyms) {
        if (defWords.some(dw => synonyms.some(s => dw.includes(s) || s.includes(dw)))) {
          thematicMatches++;
        }
      }
    }
  }

  return Math.min(25, (exactMatches * 8) + (thematicMatches * 4));
}

/**
 * Factor 3: Grammatical Naturalness (0-25)
 * Start at 25, deduct for issues.
 */
function scoreGrammaticalNaturalness(sentence: string, meanings: LetterMeaningEntry[]): number {
  let score = 25;
  const words = sentence.toLowerCase().split(/\s+/);

  // No verb in the sentence
  const hasVerb = meanings.some(m => m.role === "verb");
  if (!hasVerb && meanings.length >= 3) score -= 8;

  // Three+ nouns in a row without a verb
  let consecutiveNouns = 0;
  for (const m of meanings) {
    if (m.role === "noun" || m.role === "adjective") {
      consecutiveNouns++;
      if (consecutiveNouns >= 3) { score -= 5; break; }
    } else {
      consecutiveNouns = 0;
    }
  }

  // Sentence too short for word length
  if (words.length < 5 && meanings.length >= 3) score -= 4;

  // Duplicate adjacent meaning text
  for (let i = 0; i < meanings.length - 1; i++) {
    if (meanings[i].text === meanings[i + 1].text) score -= 5;
  }

  // Count connector word repetition
  const connectors = ["of", "the", "and", "by", "in", "with", "on"];
  for (const c of connectors) {
    const count = words.filter(w => w === c).length;
    if (count > 2) { score -= 3; break; }
  }

  return Math.max(0, Math.min(25, score));
}

/**
 * Factor 4: Theological/Thematic Coherence (0-25)
 * Check sentence against biblical theme keyword sets.
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
  const sentenceWords = sentence.toLowerCase().split(/[\s,;:.]+/);
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

  return Math.min(25, matchedThemes * 5 + totalHits * 2);
}

/**
 * Compute total score (0-100).
 */
function computeScore(
  meanings: LetterMeaningEntry[],
  sentence: string,
  strongsDef?: string
): number {
  const f1 = scorePrimaryUsage(meanings);
  const f2 = scoreStrongsAlignment(meanings, strongsDef);
  const f3 = scoreGrammaticalNaturalness(sentence, meanings);
  const f4 = scoreTheologicalCoherence(sentence, meanings);
  return f1 + f2 + f3 + f4;
}

// ============================================================
// Combination Generation
// ============================================================

/**
 * Get valid meanings for a slot: only meanings whose role matches the slot requirement.
 * "any" accepts all roles.
 */
function getMeaningsForSlot(letterMeaning: LetterMeaning, requiredRole: string): LetterMeaningEntry[] {
  if (requiredRole === "any") return letterMeaning.meanings;
  return letterMeaning.meanings.filter(m => m.role === requiredRole);
}

/**
 * Generate combinations of meanings that fit the template slots.
 * Limits to prevent performance issues.
 */
function* generateSlotCombinations(
  slotMeanings: LetterMeaningEntry[][]
): Generator<LetterMeaningEntry[]> {
  const lengths = slotMeanings.map(arr => arr.length);

  // Skip if any slot has zero valid meanings
  if (lengths.some(l => l === 0)) return;

  const total = lengths.reduce((a, b) => a * b, 1);
  const MAX = 3000;
  const limit = Math.min(total, MAX);

  const indices = new Array(slotMeanings.length).fill(0);
  for (let count = 0; count < limit; count++) {
    yield indices.map((idx, j) => slotMeanings[j][idx]);

    // Increment odometer
    for (let j = indices.length - 1; j >= 0; j--) {
      indices[j]++;
      if (indices[j] < lengths[j]) break;
      indices[j] = 0;
    }
  }
}

// ============================================================
// Main API
// ============================================================

export interface GenerateOptions {
  maxResults?: number;
  strongsDefinition?: string;
}

/**
 * Generate ranked interpretive sentences from root consonant letters.
 */
export function generateInterpretations(
  rootLetters: string[],
  letterMeaningsMatrix: LetterMeaning[],
  options: GenerateOptions = {}
): InterpretiveSentence[] {
  const { maxResults = 10, strongsDefinition } = options;

  if (rootLetters.length === 0) return [];

  // Build letter lookup
  const letterLookup = new Map<string, LetterMeaning>();
  for (const lm of letterMeaningsMatrix) {
    letterLookup.set(lm.letter, lm);
  }

  // Look up meanings for each root letter
  const letterData: LetterMeaning[] = [];
  for (const letter of rootLetters) {
    const data = letterLookup.get(letter);
    if (!data) continue;
    letterData.push(data);
  }

  if (letterData.length === 0) return [];

  const rootLen = letterData.length;

  // Get applicable templates
  let templates = TEMPLATES.filter(t => t.lengths.includes(rootLen));

  // Fallback for unsupported lengths
  if (templates.length === 0) {
    // Build a simple "{0} of {1} ... of {N}" fallback
    const slots: TemplateSlot[] = letterData.map((_, i) => ({ letterIndex: i, role: "noun" }));
    const pattern = slots.map((_, i) => i === 0 ? "The {0}" : `of the {${i}}`).join(" ");
    templates = [{ id: "FALLBACK", pattern, slots, lengths: [rootLen] }];
  }

  // Generate candidates per template, then interleave
  const perTemplate = new Map<string, InterpretiveSentence[]>();
  const seenSentences = new Set<string>();

  for (const template of templates) {
    // Build valid meanings per slot
    const slotMeanings = template.slots.map(slot =>
      getMeaningsForSlot(letterData[slot.letterIndex], slot.role)
    );

    const templateCandidates: InterpretiveSentence[] = [];

    for (const combo of generateSlotCombinations(slotMeanings)) {
      // Build slot values for formatting
      const slotValues = combo.map((m, i) => ({ text: m.text, role: template.slots[i].role }));
      const sentence = formatSentence(template.pattern, slotValues);

      // Deduplicate
      const key = sentence.toLowerCase();
      if (seenSentences.has(key)) continue;
      seenSentences.add(key);

      // Filter: skip if adjacent letters use the same meaning text
      let hasDup = false;
      for (let i = 0; i < combo.length - 1; i++) {
        if (combo[i].text === combo[i + 1].text) { hasDup = true; break; }
      }
      if (hasDup) continue;

      const score = computeScore(combo, sentence, strongsDefinition);

      // Build letterBreakdown: map slot meanings back to their letter indices
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

  // Interleave: best from each template in round-robin
  const result: InterpretiveSentence[] = [];
  const templateIds = [...perTemplate.keys()];
  const pointers = new Map<string, number>();
  for (const id of templateIds) pointers.set(id, 0);

  while (result.length < maxResults * 2) {
    let added = false;
    for (const id of templateIds) {
      const candidates = perTemplate.get(id)!;
      const ptr = pointers.get(id)!;
      if (ptr < candidates.length && ptr < 3) { // max 3 per template
        result.push(candidates[ptr]);
        pointers.set(id, ptr + 1);
        added = true;
      }
    }
    if (!added) break;
  }

  // Final sort by score, return top N
  result.sort((a, b) => b.score - a.score);
  return result.slice(0, maxResults);
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
