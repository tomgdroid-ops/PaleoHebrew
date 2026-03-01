/**
 * Client-side word lookup for interlinear display.
 * Looks up Hebrew words in a condensed gloss map to find
 * Strong's numbers and short English definitions.
 */

export interface WordGloss {
  id: string;       // Strong's number e.g. "H7225"
  gloss: string;    // Short English definition
  translit: string; // Academic transliteration from Strong's
}

interface GlossData {
  byWord: Record<string, WordGloss>;
  byId: Record<string, WordGloss>;
}

let _glossData: GlossData | null = null;

export function setGlossData(data: GlossData) {
  _glossData = data;
}

/**
 * Common Hebrew prefixes to strip when looking up root words.
 */
const PREFIXES_TO_STRIP = [
  "ב", "ה", "ו", "כ", "ל", "מ", "ש",   // single prefixes first
  "וב", "וה", "וכ", "ול", "ומ", "וש",  // vav + prefix second
];

/**
 * Common particles with hardcoded glosses to avoid wrong Strong's matches.
 */
const PARTICLES: Record<string, WordGloss> = {
  "את": { id: "H0853", gloss: "(direct object)", translit: "'et" },
  "ואת": { id: "H0853", gloss: "and (obj.)", translit: "ve'et" },
  "אל": { id: "H0413", gloss: "to, toward", translit: "'el" },
  "על": { id: "H5921", gloss: "upon, above", translit: "'al" },
  "מנ": { id: "H4480", gloss: "from", translit: "min" },
  "כי": { id: "H3588", gloss: "that, because", translit: "ki" },
  "לא": { id: "H3808", gloss: "not", translit: "lo'" },
  "אשר": { id: "H0834", gloss: "which, that", translit: "'asher" },
  "כל": { id: "H3605", gloss: "all, every", translit: "kol" },
  "גמ": { id: "H1571", gloss: "also, moreover", translit: "gam" },
  "עמ": { id: "H5973", gloss: "with", translit: "'im" },
  "בינ": { id: "H0996", gloss: "between", translit: "beyn" },
};

/**
 * Normalize consonantal text for lookup.
 * Strips final forms and normalizes to standard letters.
 */
const FINAL_TO_STANDARD: Record<string, string> = {
  "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ",
};

function normalize(text: string): string {
  return [...text].map(ch => FINAL_TO_STANDARD[ch] || ch).join("");
}

/**
 * Look up a Hebrew word to get its Strong's number and English gloss.
 */
export function lookupWord(consonantalText: string): WordGloss | null {
  if (!_glossData) return null;

  const norm = normalize(consonantalText);

  // Check hardcoded particles first
  if (PARTICLES[norm]) return PARTICLES[norm];

  // Direct lookup
  if (_glossData.byWord[norm]) return _glossData.byWord[norm];

  // Try stripping prefixes
  for (const prefix of PREFIXES_TO_STRIP) {
    if (norm.startsWith(prefix) && norm.length > prefix.length + 1) {
      const stripped = norm.slice(prefix.length);
      if (_glossData.byWord[stripped]) {
        return _glossData.byWord[stripped];
      }
    }
  }

  return null;
}

/**
 * Look up by Strong's ID directly.
 */
export function lookupById(strongsId: string): WordGloss | null {
  if (!_glossData) return null;
  return _glossData.byId[strongsId] || null;
}
