// === Torah Text Types ===

export interface TorahVerse {
  book: string;
  bookHe: string;
  chapter: number;
  verse: number;
  text: string; // Full verse Hebrew text (consonantal, no nikkud)
  textNiqqud?: string; // Pointed text for display
  english?: string; // English translation
  words: TorahWord[];
}

export interface TorahWord {
  text: string; // Hebrew word as it appears in verse (consonantal)
  textNiqqud: string; // Pointed text from OSHB
  lemma: string; // Strong's number, e.g. "H7225"
  morph: string; // Morphology code
  position: number; // Word index within the verse
}

// === Letter Meanings Types ===

export interface LetterMeaningEntry {
  text: string;
  role: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "conjunction" | "article";
  primary: boolean;
}

export interface LetterMeaning {
  letter: string; // Modern Hebrew: "א"
  name: string; // "Aleph"
  paleoUnicode: string; // "\u{10900}"
  pictograph: string; // "Ox head"
  gematria: number;
  meanings: LetterMeaningEntry[];
}

// === Strong's Dictionary Types ===

export interface StrongsEntry {
  id: string; // "H7225"
  word: string; // Hebrew word with nikkud
  wordConsonantal: string; // Without nikkud
  transliteration: string;
  pos: string; // Part of speech
  definition: string;
  rootLetters: string[]; // ["ר", "א", "ש"]
}

// === Sentence Engine Types ===

export interface LetterInterpretation {
  letter: string;
  name: string;
  paleoUnicode: string;
  pictograph: string;
  chosenMeaning: string;
  role: string;
  allMeanings: LetterMeaningEntry[];
}

export interface InterpretiveSentence {
  sentence: string;
  score: number; // 0-100
  letterBreakdown: LetterInterpretation[];
  pattern: string; // Which template pattern was used
  themes?: string[]; // Thematic tags (for curated sentences)
  curated?: boolean; // True if from curated-sentences.json
}

// === Curated Sentences Types ===

export interface CuratedMeaningUsed {
  letter: string;
  meaning: string;
  primary: boolean;
}

export interface CuratedSentence {
  sentence: string;
  score: number;
  themes: string[];
  meanings_used: CuratedMeaningUsed[];
}

export interface CuratedWordEntry {
  word: string;
  strongsId: string;
  sentences: CuratedSentence[];
}

export interface DecodedWord {
  word: string; // Original Hebrew word
  wordConsonantal: string; // Without nikkud
  lemma: string; // Strong's number
  strongs?: StrongsEntry;
  rootLetters: string[];
  paleoHebrew: string; // Paleo-Hebrew rendering
  letterDetails: LetterInterpretation[];
  interpretations: InterpretiveSentence[];
}

// === Navigation Types ===

export interface BookMeta {
  name: string; // "Genesis"
  nameHe: string; // "בראשית"
  slug: string; // "genesis"
  chapters: number; // 50
  verseCounts: number[]; // verses per chapter
}

export interface TorahChapter {
  book: string;
  bookHe: string;
  chapter: number;
  verses: TorahVerse[];
}

export interface TorahBook {
  book: string;
  bookHe: string;
  slug: string;
  chapters: TorahChapter[];
}

// === Sentence Template Types ===

export interface SentenceTemplate {
  id: string;
  pattern: string; // e.g., "The {0} of {1}"
  rootLengths: number[];
  rolePattern: string[][]; // Required roles per slot
  baseScore: number;
  connectorType: string;
}
