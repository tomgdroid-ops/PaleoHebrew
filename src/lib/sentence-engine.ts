/**
 * Sentence Generation Engine for the Paleo-Hebrew Torah Decoder.
 *
 * Takes root consonant letters, looks up their pictographic meanings,
 * and generates ranked interpretive sentences using template patterns.
 */

import type {
  LetterMeaning,
  LetterMeaningEntry,
  LetterInterpretation,
  InterpretiveSentence,
  StrongsEntry,
} from "@/types";

// ============================================================
// Sentence Templates
// ============================================================

interface Template {
  id: string;
  pattern: string; // Uses {0}, {1}, {2}... placeholders
  lengths: number[]; // Which root lengths this applies to
  baseScore: number; // 0-1 base quality
  // Preferred role sequences (each slot can accept multiple roles)
  preferredRoles?: string[][];
}

const TEMPLATES: Template[] = [
  // === 2-letter root templates ===
  { id: "P1", pattern: "The {0} of the {1}", lengths: [2], baseScore: 1.0,
    preferredRoles: [["noun"], ["noun"]] },
  { id: "P1b", pattern: "{0} of {1}", lengths: [2], baseScore: 0.95,
    preferredRoles: [["noun"], ["noun"]] },
  { id: "P2", pattern: "The {0} within the {1}", lengths: [2], baseScore: 0.9,
    preferredRoles: [["noun"], ["noun"]] },
  { id: "P2b", pattern: "{0} inside the {1}", lengths: [2], baseScore: 0.85,
    preferredRoles: [["noun"], ["noun"]] },
  { id: "P3", pattern: "To {0} the {1}", lengths: [2], baseScore: 0.9,
    preferredRoles: [["verb"], ["noun"]] },
  { id: "P3b", pattern: "{0} the {1}", lengths: [2], baseScore: 0.85,
    preferredRoles: [["verb"], ["noun"]] },
  { id: "P4", pattern: "The {0} who {1}", lengths: [2], baseScore: 0.88,
    preferredRoles: [["noun"], ["verb"]] },
  { id: "P5", pattern: "The {0} {1}", lengths: [2], baseScore: 0.82,
    preferredRoles: [["adjective"], ["noun"]] },
  { id: "P5b", pattern: "{0} {1}", lengths: [2], baseScore: 0.75,
    preferredRoles: [["noun", "adjective"], ["noun"]] },

  // === 3-letter root templates ===
  { id: "P6", pattern: "The {0} of the {1} that {2}", lengths: [3], baseScore: 1.0,
    preferredRoles: [["noun"], ["noun"], ["verb"]] },
  { id: "P6b", pattern: "{0} of {1} and {2}", lengths: [3], baseScore: 0.92,
    preferredRoles: [["noun"], ["noun"], ["noun"]] },
  { id: "P7", pattern: "The {0} {1} the {2}", lengths: [3], baseScore: 0.95,
    preferredRoles: [["noun"], ["verb"], ["noun"]] },
  { id: "P7b", pattern: "{0} {1} toward {2}", lengths: [3], baseScore: 0.88,
    preferredRoles: [["noun"], ["verb"], ["noun"]] },
  { id: "P8", pattern: "The {0} of the {1} {2}", lengths: [3], baseScore: 0.9,
    preferredRoles: [["noun"], ["adjective"], ["noun"]] },
  { id: "P8b", pattern: "The {0} {1} of {2}", lengths: [3], baseScore: 0.87,
    preferredRoles: [["adjective"], ["noun"], ["noun"]] },
  { id: "P9", pattern: "To {0} the {1} of the {2}", lengths: [3], baseScore: 0.85,
    preferredRoles: [["verb"], ["noun"], ["noun"]] },
  { id: "P10", pattern: "The {0}, {1} of {2}", lengths: [3], baseScore: 0.83,
    preferredRoles: [["noun"], ["noun"], ["noun"]] },

  // === 4-letter root templates ===
  { id: "P11", pattern: "The {0} of the {1}, {2} with {3}", lengths: [4], baseScore: 1.0,
    preferredRoles: [["noun"], ["noun"], ["verb", "noun"], ["noun"]] },
  { id: "P12", pattern: "{0} of {1} that {2} the {3}", lengths: [4], baseScore: 0.95,
    preferredRoles: [["noun"], ["noun"], ["verb"], ["noun"]] },
  { id: "P13", pattern: "The {0} {1} the {2} of the {3}", lengths: [4], baseScore: 0.92,
    preferredRoles: [["noun"], ["verb"], ["noun"], ["noun"]] },
  { id: "P14", pattern: "{0} within the {1}, {2} upon the {3}", lengths: [4], baseScore: 0.88,
    preferredRoles: [["noun"], ["noun"], ["noun", "verb"], ["noun"]] },

  // === 5-letter root templates ===
  { id: "P15", pattern: "The {0} of the {1} that {2} the {3} with {4}", lengths: [5], baseScore: 1.0,
    preferredRoles: [["noun"], ["noun"], ["verb"], ["noun"], ["noun"]] },
  { id: "P16", pattern: "{0} of {1}, {2} the {3} of {4}", lengths: [5], baseScore: 0.92,
    preferredRoles: [["noun"], ["noun"], ["verb"], ["noun"], ["noun"]] },

  // === 6-letter root templates ===
  { id: "P17", pattern: "The {0} of the {1}, the {2} that {3} the {4} upon the {5}", lengths: [6], baseScore: 1.0,
    preferredRoles: [["noun"], ["noun"], ["noun"], ["verb"], ["noun"], ["noun"]] },
  { id: "P18", pattern: "{0} of the {1}, {2} {3} through {4} toward {5}", lengths: [6], baseScore: 0.9,
    preferredRoles: [["noun"], ["noun"], ["noun"], ["verb"], ["noun"], ["noun"]] },
];

// ============================================================
// Scoring Functions
// ============================================================

/**
 * Score how well the chosen meanings match the preferred roles of the template.
 */
function scoreRoleAlignment(
  chosenMeanings: LetterMeaningEntry[],
  template: Template
): number {
  if (!template.preferredRoles) return 15;

  let roleScore = 0;
  const maxPerSlot = 25 / chosenMeanings.length;

  for (let i = 0; i < chosenMeanings.length; i++) {
    const preferred = template.preferredRoles[i];
    if (preferred && preferred.includes(chosenMeanings[i].role)) {
      roleScore += maxPerSlot;
    } else {
      roleScore += maxPerSlot * 0.3; // Partial credit for non-preferred role
    }
  }

  return roleScore;
}

// Abstract/metaphorical meanings tend to produce better interpretive sentences
const PREFERRED_ABSTRACT_MEANINGS = new Set([
  "strength", "power", "leader", "authority", "family", "house", "inside",
  "to teach", "to learn", "to guide", "to reveal", "breath", "spirit",
  "covenant", "sign", "mark", "truth", "hand", "deed", "water", "sea",
  "head", "beginning", "first", "seed", "offspring", "heir", "eye",
  "to see", "to know", "mouth", "to speak", "word", "teeth", "fire",
  "door", "pathway", "wall", "to protect", "to support", "journey",
  "life", "shepherd",
]);

/**
 * Score based on whether meanings are primary (more scholarly consensus)
 * and whether they are abstract vs literal pictograph names.
 */
function scoreScholarlyFrequency(chosenMeanings: LetterMeaningEntry[]): number {
  const total = chosenMeanings.length;
  let score = 0;
  const perMeaning = 25 / total;

  for (const m of chosenMeanings) {
    let meaningScore = 0;
    if (m.primary) meaningScore += perMeaning * 0.6;
    else meaningScore += perMeaning * 0.2;
    // Bonus for abstract/metaphorical meanings
    if (PREFERRED_ABSTRACT_MEANINGS.has(m.text)) meaningScore += perMeaning * 0.4;
    score += meaningScore;
  }

  return Math.min(25, score);
}

/**
 * Score based on alignment with the Strong's definition.
 * If any chosen meaning word appears in the Strong's definition, bonus points.
 */
function scoreStrongsAlignment(
  chosenMeanings: LetterMeaningEntry[],
  strongsDef?: string
): number {
  if (!strongsDef) return 12.5; // Neutral score when no Strong's available

  const defLower = strongsDef.toLowerCase();
  let matches = 0;

  for (const meaning of chosenMeanings) {
    const word = meaning.text.toLowerCase().replace(/^to /, "");
    if (defLower.includes(word)) {
      matches++;
    }
  }

  // Scale: 0 matches = 5, 1 match = 15, 2+ matches = 25
  if (matches === 0) return 5;
  if (matches === 1) return 15;
  return 25;
}

/**
 * Grammatical naturalness score based on the template's base score
 * and some heuristic checks.
 */
function scoreGrammaticalNaturalness(
  chosenMeanings: LetterMeaningEntry[],
  template: Template
): number {
  let score = template.baseScore * 20;

  // Penalize if adjacent meanings are the same word
  for (let i = 0; i < chosenMeanings.length - 1; i++) {
    if (chosenMeanings[i].text === chosenMeanings[i + 1].text) {
      score -= 10;
    }
  }

  // Penalize verb + "of" + verb patterns (grammatically awkward)
  if (
    chosenMeanings.length >= 2 &&
    chosenMeanings[0].role === "verb" &&
    chosenMeanings[1].role === "verb" &&
    template.pattern.includes("of")
  ) {
    score -= 5;
  }

  // Penalize adjective + "of" + adjective
  if (
    chosenMeanings.length >= 2 &&
    chosenMeanings[0].role === "adjective" &&
    chosenMeanings[1].role === "adjective" &&
    template.pattern.includes("of")
  ) {
    score -= 5;
  }

  return Math.max(0, Math.min(25, score));
}

/**
 * Compute total score for a candidate sentence.
 */
function computeScore(
  chosenMeanings: LetterMeaningEntry[],
  template: Template,
  strongsDef?: string
): number {
  const scholarly = scoreScholarlyFrequency(chosenMeanings);
  const alignment = scoreStrongsAlignment(chosenMeanings, strongsDef);
  const grammatical = scoreGrammaticalNaturalness(chosenMeanings, template);
  const roleScore = scoreRoleAlignment(chosenMeanings, template);

  return Math.round(scholarly + alignment + grammatical + roleScore);
}

// ============================================================
// Sentence Generation
// ============================================================

/**
 * Conjugate a verb meaning for natural sentence flow.
 * "to lead" → "leads", "to consume" → "consumes", etc.
 */
function conjugateVerb(text: string): string {
  if (!text.startsWith("to ")) return text;
  const verb = text.slice(3);
  // Simple English conjugation rules
  if (verb.endsWith("e")) return verb + "s"; // consume → consumes
  if (verb.endsWith("ch") || verb.endsWith("sh") || verb.endsWith("ss") || verb.endsWith("x") || verb.endsWith("o")) {
    return verb + "es";
  }
  if (verb.endsWith("y") && !"aeiou".includes(verb[verb.length - 2])) {
    return verb.slice(0, -1) + "ies"; // carry → carries
  }
  return verb + "s";
}

/**
 * Get the bare infinitive form of a verb for "To X" patterns.
 * "to lead" → "lead"
 */
function bareVerb(text: string): string {
  return text.startsWith("to ") ? text.slice(3) : text;
}

/**
 * Format a sentence from a template pattern and meaning entries.
 * Handles verb conjugation based on context.
 */
function formatSentence(
  pattern: string,
  meanings: LetterMeaningEntry[]
): string {
  let result = pattern;
  for (let i = 0; i < meanings.length; i++) {
    let text = meanings[i].text;
    const isVerb = meanings[i].role === "verb";

    if (isVerb) {
      // Check pattern context for this slot
      const placeholder = `{${i}}`;
      const idx = result.indexOf(placeholder);
      if (idx > 0) {
        const before = result.substring(Math.max(0, idx - 10), idx).trim().toLowerCase();
        if (before.endsWith("that") || before.endsWith("who") || before.endsWith("which")) {
          text = conjugateVerb(text);
        } else if (before.endsWith("to")) {
          text = bareVerb(text);
        } else {
          text = conjugateVerb(text);
        }
      }
    }

    result = result.replace(`{${i}}`, text);
  }
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Generate all valid meaning combinations for the given letters.
 * Limits total combinations to prevent performance issues.
 */
function* generateCombinations(
  letterMeaningsArr: LetterMeaningEntry[][]
): Generator<LetterMeaningEntry[]> {
  const lengths = letterMeaningsArr.map((arr) => arr.length);
  const total = lengths.reduce((a, b) => a * b, 1);
  const MAX_COMBINATIONS = 5000;
  const limit = Math.min(total, MAX_COMBINATIONS);

  if (total <= MAX_COMBINATIONS) {
    // Generate all combinations
    const indices = new Array(letterMeaningsArr.length).fill(0);
    for (let i = 0; i < total; i++) {
      yield indices.map((idx, j) => letterMeaningsArr[j][idx]);
      // Increment indices (odometer-style)
      for (let j = indices.length - 1; j >= 0; j--) {
        indices[j]++;
        if (indices[j] < lengths[j]) break;
        indices[j] = 0;
      }
    }
  } else {
    // Sample combinations: prioritize primary meanings first, then sample randomly
    // First, yield all-primary combination
    const allPrimary = letterMeaningsArr.map(
      (arr) => arr.find((m) => m.primary) || arr[0]
    );
    yield allPrimary;

    // Then generate systematically up to limit
    const indices = new Array(letterMeaningsArr.length).fill(0);
    let count = 1;
    for (let i = 0; i < total && count < limit; i++) {
      // Increment
      for (let j = indices.length - 1; j >= 0; j--) {
        indices[j]++;
        if (indices[j] < lengths[j]) break;
        indices[j] = 0;
      }
      const combo = indices.map((idx, j) => letterMeaningsArr[j][idx]);
      // Skip the all-primary we already yielded
      if (combo.every((m, j) => m === allPrimary[j])) continue;
      yield combo;
      count++;
    }
  }
}

/**
 * Check if a combination should be filtered out.
 */
function shouldFilter(combo: LetterMeaningEntry[]): boolean {
  // Filter duplicate adjacent meanings
  for (let i = 0; i < combo.length - 1; i++) {
    if (combo[i].text === combo[i + 1].text) return true;
  }
  return false;
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
 *
 * @param rootLetters Array of Hebrew consonant characters
 * @param letterMeaningsMatrix The full 22-letter meanings dataset
 * @param options Configuration options
 * @returns Ranked array of InterpretiveSentence
 */
export function generateInterpretations(
  rootLetters: string[],
  letterMeaningsMatrix: LetterMeaning[],
  options: GenerateOptions = {}
): InterpretiveSentence[] {
  const { maxResults = 10, strongsDefinition } = options;

  if (rootLetters.length === 0) return [];

  // Build a lookup from letter to its LetterMeaning
  const letterLookup = new Map<string, LetterMeaning>();
  for (const lm of letterMeaningsMatrix) {
    letterLookup.set(lm.letter, lm);
  }

  // Look up meanings for each root letter
  const letterData: LetterMeaning[] = [];
  for (const letter of rootLetters) {
    const data = letterLookup.get(letter);
    if (!data) continue; // Skip unknown letters
    letterData.push(data);
  }

  if (letterData.length === 0) return [];

  const rootLen = letterData.length;

  // Get applicable templates
  const templates = TEMPLATES.filter((t) => t.lengths.includes(rootLen));

  // If no templates for this length, use a generic fallback
  if (templates.length === 0) {
    // For very long roots, use the longest available template length
    const maxTemplateLen = Math.max(...TEMPLATES.map((t) => Math.max(...t.lengths)));
    if (rootLen > maxTemplateLen) {
      // Chain meanings with "of" connectors
      const fallbackTemplate: Template = {
        id: "FALLBACK",
        pattern: letterData.map((_, i) => `{${i}}`).join(" of "),
        lengths: [rootLen],
        baseScore: 0.6,
      };
      templates.push(fallbackTemplate);
    }
  }

  // Build meaning arrays for combination generation
  const meaningArrays = letterData.map((ld) => ld.meanings);

  // Generate and score all candidates
  const candidates: InterpretiveSentence[] = [];
  const seenSentences = new Set<string>();

  for (const template of templates) {
    for (const combo of generateCombinations(meaningArrays)) {
      if (shouldFilter(combo)) continue;

      const sentence = formatSentence(template.pattern, combo);

      // Deduplicate
      if (seenSentences.has(sentence.toLowerCase())) continue;
      seenSentences.add(sentence.toLowerCase());

      const score = computeScore(combo, template, strongsDefinition);

      candidates.push({
        sentence,
        score,
        pattern: template.id,
        letterBreakdown: combo.map((meaning, i) => ({
          letter: letterData[i].letter,
          name: letterData[i].name,
          paleoUnicode: letterData[i].paleoUnicode,
          pictograph: letterData[i].pictograph,
          chosenMeaning: meaning.text,
          role: meaning.role,
          allMeanings: letterData[i].meanings,
        })),
      });
    }
  }

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Return top N
  return candidates.slice(0, maxResults);
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
