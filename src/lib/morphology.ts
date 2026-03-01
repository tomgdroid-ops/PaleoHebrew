/**
 * Decode OSHB morphology codes into human-readable English.
 *
 * Format: Language/PartOfSpeech+features
 * Examples:
 *   "HR/Ncfsa"  → "Hebrew — Noun, common, feminine, singular, absolute"
 *   "HR/Vqp3ms" → "Hebrew — Verb, Qal, perfect, 3rd person, masculine, singular"
 *   "HD/Td"     → "Hebrew — Article, determined"
 */

const LANGUAGES: Record<string, string> = {
  H: "Hebrew",
  A: "Aramaic",
};

const PART_OF_SPEECH: Record<string, string> = {
  A: "Adjective",
  C: "Conjunction",
  D: "Adverb",
  N: "Noun",
  P: "Pronoun",
  R: "Preposition",
  S: "Suffix",
  T: "Article",
  V: "Verb",
};

const VERB_STEMS_HEBREW: Record<string, string> = {
  q: "Qal",
  N: "Niphal",
  p: "Piel",
  P: "Pual",
  h: "Hiphil",
  H: "Hophal",
  t: "Hithpael",
  o: "Polel",
  O: "Polal",
  r: "Hithpolel",
  m: "Poel",
  M: "Poal",
  k: "Palel",
  K: "Pulal",
  Q: "Qal passive",
  l: "Pilpel",
  L: "Polpal",
  f: "Hithpalpel",
  D: "Nithpael",
  j: "Pealal",
  i: "Pilel",
  u: "Hothpaal",
  c: "Tiphil",
  v: "Hishtaphel",
  w: "Nithpalel",
  y: "Nithpoel",
  z: "Hithpoel",
};

const VERB_STEMS_ARAMAIC: Record<string, string> = {
  q: "Peal",
  Q: "Peil",
  u: "Hithpeel",
  p: "Pael",
  P: "Ithpaal",
  M: "Hithpaal",
  a: "Aphel",
  h: "Haphel",
  s: "Shaphel",
  e: "Shaphel",
  H: "Hophal",
  i: "Ithpeel",
  t: "Hishtaphel",
  v: "Ishtaphel",
  w: "Hithaphel",
};

const VERB_CONJUGATIONS: Record<string, string> = {
  p: "perfect",
  q: "sequential perfect",
  i: "imperfect",
  w: "sequential imperfect",
  h: "cohortative",
  j: "jussive",
  v: "imperative",
  r: "participle active",
  s: "participle passive",
  a: "infinitive absolute",
  c: "infinitive construct",
};

const PERSON: Record<string, string> = {
  "1": "1st person",
  "2": "2nd person",
  "3": "3rd person",
};

const GENDER: Record<string, string> = {
  m: "masculine",
  f: "feminine",
  c: "common",
  b: "both",
};

const NUMBER: Record<string, string> = {
  s: "singular",
  p: "plural",
  d: "dual",
};

const STATE: Record<string, string> = {
  a: "absolute",
  c: "construct",
  d: "determined",
};

const NOUN_TYPE: Record<string, string> = {
  c: "common",
  g: "gentilic",
  p: "proper",
};

const PRONOUN_TYPE: Record<string, string> = {
  d: "demonstrative",
  f: "indefinite",
  i: "interrogative",
  p: "personal",
  r: "relative",
};

/**
 * Decode an OSHB morphology code into readable English.
 */
export function decodeMorphology(morph: string): string {
  if (!morph || morph === "-") return "";

  const parts: string[] = [];

  // Strip prefix markers like "R/" (root marker) or "H" language prefix
  // Format can be: "HR/Ncfsa", "HC/Vqp3ms", "HD/Td"
  // Or simpler: "HNcfsa", "HTd"

  // Split on "/" to separate prefix segments
  const segments = morph.split("/");
  let language = "";
  let mainCode = "";

  if (segments.length === 1) {
    // No slash: first char is language
    language = segments[0][0] || "";
    mainCode = segments[0].slice(1);
  } else {
    // Has slash(es): parse prefix segments for language, then last segment is the main code
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];
      for (const ch of seg) {
        if (LANGUAGES[ch]) {
          language = ch;
        }
      }
    }
    mainCode = segments[segments.length - 1];
  }

  // Language
  if (LANGUAGES[language]) {
    parts.push(LANGUAGES[language]);
  }

  if (!mainCode) {
    return parts.join(" — ") || morph;
  }

  // First character of mainCode is part of speech
  const pos = mainCode[0];
  const posName = PART_OF_SPEECH[pos];
  if (!posName) {
    return parts.length > 0 ? `${parts[0]} — ${morph}` : morph;
  }

  const features: string[] = [posName];
  const rest = mainCode.slice(1);

  if (pos === "V") {
    // Verb: stem + conjugation + person + gender + number
    const stemMap = language === "A" ? VERB_STEMS_ARAMAIC : VERB_STEMS_HEBREW;
    let idx = 0;
    if (rest[idx] && stemMap[rest[idx]]) {
      features.push(stemMap[rest[idx]]);
      idx++;
    }
    if (rest[idx] && VERB_CONJUGATIONS[rest[idx]]) {
      features.push(VERB_CONJUGATIONS[rest[idx]]);
      idx++;
    }
    if (rest[idx] && PERSON[rest[idx]]) {
      features.push(PERSON[rest[idx]]);
      idx++;
    }
    if (rest[idx] && GENDER[rest[idx]]) {
      features.push(GENDER[rest[idx]]);
      idx++;
    }
    if (rest[idx] && NUMBER[rest[idx]]) {
      features.push(NUMBER[rest[idx]]);
      idx++;
    }
  } else if (pos === "N") {
    // Noun: type + gender + number + state
    let idx = 0;
    if (rest[idx] && NOUN_TYPE[rest[idx]]) {
      features.push(NOUN_TYPE[rest[idx]]);
      idx++;
    }
    if (rest[idx] && GENDER[rest[idx]]) {
      features.push(GENDER[rest[idx]]);
      idx++;
    }
    if (rest[idx] && NUMBER[rest[idx]]) {
      features.push(NUMBER[rest[idx]]);
      idx++;
    }
    if (rest[idx] && STATE[rest[idx]]) {
      features.push(STATE[rest[idx]]);
      idx++;
    }
  } else if (pos === "A") {
    // Adjective: gender + number + state
    let idx = 0;
    if (rest[idx] && GENDER[rest[idx]]) {
      features.push(GENDER[rest[idx]]);
      idx++;
    }
    if (rest[idx] && NUMBER[rest[idx]]) {
      features.push(NUMBER[rest[idx]]);
      idx++;
    }
    if (rest[idx] && STATE[rest[idx]]) {
      features.push(STATE[rest[idx]]);
      idx++;
    }
  } else if (pos === "P") {
    // Pronoun: type + person + gender + number
    let idx = 0;
    if (rest[idx] && PRONOUN_TYPE[rest[idx]]) {
      features.push(PRONOUN_TYPE[rest[idx]]);
      idx++;
    }
    if (rest[idx] && PERSON[rest[idx]]) {
      features.push(PERSON[rest[idx]]);
      idx++;
    }
    if (rest[idx] && GENDER[rest[idx]]) {
      features.push(GENDER[rest[idx]]);
      idx++;
    }
    if (rest[idx] && NUMBER[rest[idx]]) {
      features.push(NUMBER[rest[idx]]);
      idx++;
    }
  } else if (pos === "S") {
    // Suffix: person + gender + number
    let idx = 0;
    if (rest[idx] && PERSON[rest[idx]]) {
      features.push(PERSON[rest[idx]]);
      idx++;
    }
    if (rest[idx] && GENDER[rest[idx]]) {
      features.push(GENDER[rest[idx]]);
      idx++;
    }
    if (rest[idx] && NUMBER[rest[idx]]) {
      features.push(NUMBER[rest[idx]]);
      idx++;
    }
  } else if (pos === "T") {
    // Article
    let idx = 0;
    if (rest[idx] && STATE[rest[idx]]) {
      features.push(STATE[rest[idx]]);
      idx++;
    }
  }
  // C (Conjunction), D (Adverb), R (Preposition) typically have no further features

  const description = features.join(", ");
  return parts.length > 0 ? `${parts[0]} — ${description}` : description;
}
