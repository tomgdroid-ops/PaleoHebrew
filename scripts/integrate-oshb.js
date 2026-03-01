/**
 * integrate-oshb.js
 *
 * Parses OSHB XML files and integrates Strong's numbers + morphology codes
 * into our Torah JSON data files.
 *
 * Strategy:
 * 1. Parse each OSHB XML file to extract word-level data per verse
 * 2. For each verse, match OSHB words to our Torah words by position
 * 3. Handle prefix-separated words (OSHB uses "/" to split prefixes)
 * 4. Handle maqqef-joined words (OSHB splits them, we may combine them)
 * 5. Write the Strong's ID (lemma) and morph code onto each word
 */

const fs = require("fs");
const path = require("path");

// Book mapping: our slug -> OSHB filename
const BOOK_MAP = {
  genesis: "Gen",
  exodus: "Exod",
  leviticus: "Lev",
  numbers: "Num",
  deuteronomy: "Deut",
};

const DATA_DIR = path.resolve(__dirname, "..", "data");
const OSHB_DIR = path.join(DATA_DIR, "oshb");

/**
 * Strip all Unicode nikkud (vowel points), cantillation marks, and special chars from Hebrew text.
 */
function stripNikkud(text) {
  // Remove combining marks: U+0591-U+05BD, U+05BF, U+05C1-U+05C2, U+05C4-U+05C7
  // Keep consonants (U+05D0-U+05EA) and final forms
  return text.replace(/[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4-\u05C7]/g, "");
}

/**
 * Normalize final forms to standard for comparison.
 */
const FINAL_TO_STANDARD = {
  "\u05DA": "\u05DB", // ך -> כ
  "\u05DD": "\u05DE", // ם -> מ
  "\u05DF": "\u05E0", // ן -> נ
  "\u05E3": "\u05E4", // ף -> פ
  "\u05E5": "\u05E6", // ץ -> צ
};

function normalizeFinals(text) {
  return [...text].map(ch => FINAL_TO_STANDARD[ch] || ch).join("");
}

/**
 * Extract consonantal form from text (strip nikkud, normalize finals).
 */
function toConsonantal(text) {
  let cleaned = stripNikkud(text);
  // Remove separators
  cleaned = cleaned.replace(/\//g, "");
  // Remove sof pasuq, paseq, maqaf
  cleaned = cleaned.replace(/[\u05C3\u05C0\u05BE]/g, "");
  // Remove pe/samekh paragraph markers and other non-letter chars
  cleaned = cleaned.replace(/[^\u05D0-\u05EA]/g, "");
  return normalizeFinals(cleaned);
}

/**
 * Parse a lemma string from OSHB to extract Strong's numbers.
 * Examples:
 *   "b/7225"      -> ["H7225"]  (prefix b + Strong's 7225)
 *   "1254 a"      -> ["H1254"]  (Strong's 1254, variant a)
 *   "430"          -> ["H0430"]
 *   "c/853"        -> ["H0853"]
 *   "d/8064"       -> ["H8064"]
 *   "c/d/776"      -> ["H0776"]
 *   "c/l/4723 c"   -> ["H4723"]
 */
function parseLemma(lemmaStr) {
  if (!lemmaStr) return [];

  const parts = lemmaStr.split("/");
  const strongs = [];

  for (const part of parts) {
    // Skip prefix markers (single lowercase letters)
    const trimmed = part.trim();
    if (/^[a-z]$/.test(trimmed)) continue;

    // Extract the numeric Strong's number
    const match = trimmed.match(/^(\d+)/);
    if (match) {
      const num = match[1];
      // Pad to 4 digits
      const padded = num.padStart(4, "0");
      strongs.push("H" + padded);
    }
  }

  return strongs;
}

/**
 * Parse OSHB XML to extract per-verse word data.
 * Returns: { "1.1": [ {text, nikkud, lemma, morph, strongs}, ... ], ... }
 */
function parseOSHB(xmlPath) {
  const xml = fs.readFileSync(xmlPath, "utf-8");
  const verses = {};

  // Match each verse block
  const verseRegex = /<verse\s+osisID="[^.]+\.(\d+)\.(\d+)">([\s\S]*?)<\/verse>/g;
  let verseMatch;

  while ((verseMatch = verseRegex.exec(xml)) !== null) {
    const chapter = parseInt(verseMatch[1]);
    const verse = parseInt(verseMatch[2]);
    const verseContent = verseMatch[3];
    const key = `${chapter}.${verse}`;

    // Extract all <w> elements from this verse
    const wordRegex = /<w\s+([^>]*)>([^<]*)<\/w>/g;
    let wordMatch;
    const words = [];

    while ((wordMatch = wordRegex.exec(verseContent)) !== null) {
      const attrs = wordMatch[1];
      const hebrewText = wordMatch[2];

      // Extract lemma attribute
      const lemmaMatch = attrs.match(/lemma="([^"]*)"/);
      const lemma = lemmaMatch ? lemmaMatch[1] : "";

      // Extract morph attribute
      const morphMatch = attrs.match(/morph="([^"]*)"/);
      const morph = morphMatch ? morphMatch[1] : "";

      const strongs = parseLemma(lemma);
      const consonantal = toConsonantal(hebrewText);

      words.push({
        nikkud: hebrewText.replace(/\//g, ""),  // Remove prefix separators
        consonantal,
        lemma,
        morph,
        strongs,  // Array of Strong's numbers found in this word
      });
    }

    verses[key] = words;
  }

  return verses;
}

/**
 * Match OSHB words to our Torah words for a single verse.
 * OSHB may have more words due to maqqef splits.
 * Our words may combine maqqef-joined words.
 *
 * Strategy: Walk through both arrays. If our word matches the next OSHB word
 * exactly (consonantal), great. If not, try combining consecutive OSHB words
 * to match our word.
 */
function matchWords(ourWords, oshbWords) {
  const results = [];
  let oshbIdx = 0;

  for (let i = 0; i < ourWords.length; i++) {
    const ourWord = ourWords[i];
    const ourConsonantal = toConsonantal(ourWord.textNiqqud || ourWord.text);

    if (oshbIdx >= oshbWords.length) {
      // Ran out of OSHB words
      results.push({ strongsId: "", morph: "" });
      continue;
    }

    // Try exact match with current OSHB word
    const oshbWord = oshbWords[oshbIdx];
    if (oshbWord.consonantal === ourConsonantal) {
      // Direct match
      const primaryStrongs = oshbWord.strongs.length > 0 ? oshbWord.strongs[oshbWord.strongs.length - 1] : "";
      results.push({ strongsId: primaryStrongs, morph: oshbWord.morph });
      oshbIdx++;
      continue;
    }

    // Try combining consecutive OSHB words (maqqef-joined)
    let combined = oshbWord.consonantal;
    let combinedStrongs = [...oshbWord.strongs];
    let combinedMorph = oshbWord.morph;
    let matched = false;

    for (let j = oshbIdx + 1; j < Math.min(oshbIdx + 4, oshbWords.length); j++) {
      combined += oshbWords[j].consonantal;
      combinedStrongs.push(...oshbWords[j].strongs);

      if (combined === ourConsonantal) {
        // Found a match by combining OSHB words
        // Use the last (most significant) Strong's number
        const primaryStrongs = combinedStrongs.length > 0 ? combinedStrongs[combinedStrongs.length - 1] : "";
        results.push({ strongsId: primaryStrongs, morph: combinedMorph });
        oshbIdx = j + 1;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Fallback: Try stripping our word of common suffixes/prefixes
      // Or just skip OSHB word and try next
      // Use best effort: assign current OSHB word's strongs
      const primaryStrongs = oshbWord.strongs.length > 0 ? oshbWord.strongs[oshbWord.strongs.length - 1] : "";
      results.push({ strongsId: primaryStrongs, morph: oshbWord.morph });
      oshbIdx++;
    }
  }

  return results;
}

/**
 * Process a single book.
 */
function processBook(slug) {
  const oshbFile = BOOK_MAP[slug];
  if (!oshbFile) {
    console.error(`No OSHB mapping for ${slug}`);
    return;
  }

  const xmlPath = path.join(OSHB_DIR, `${oshbFile}.xml`);
  const torahPath = path.join(DATA_DIR, "torah", `${slug}.json`);

  if (!fs.existsSync(xmlPath)) {
    console.error(`OSHB file not found: ${xmlPath}`);
    return;
  }
  if (!fs.existsSync(torahPath)) {
    console.error(`Torah file not found: ${torahPath}`);
    return;
  }

  console.log(`Processing ${slug}...`);

  // Parse OSHB
  const oshbVerses = parseOSHB(xmlPath);

  // Load our Torah data
  const torah = JSON.parse(fs.readFileSync(torahPath, "utf-8"));

  let totalWords = 0;
  let matchedWords = 0;
  let unmatchedWords = 0;

  for (const chapter of torah.chapters) {
    for (const verse of chapter.verses) {
      const key = `${verse.chapter || chapter.chapter}.${verse.verse}`;
      const oshbWords = oshbVerses[key];

      if (!oshbWords) {
        console.warn(`  No OSHB data for ${slug} ${key}`);
        continue;
      }

      const matches = matchWords(verse.words, oshbWords);

      for (let i = 0; i < verse.words.length; i++) {
        totalWords++;
        if (matches[i] && matches[i].strongsId) {
          verse.words[i].lemma = matches[i].strongsId;
          verse.words[i].morph = matches[i].morph;
          matchedWords++;
        } else {
          unmatchedWords++;
        }
      }
    }
  }

  // Write updated Torah data
  fs.writeFileSync(torahPath, JSON.stringify(torah, null, 2), "utf-8");

  const pct = Math.round((matchedWords / totalWords) * 100);
  console.log(`  ${slug}: ${matchedWords}/${totalWords} words matched (${pct}%), ${unmatchedWords} unmatched`);
}

// Also update word-glosses.json: add byId entries for any new Strong's numbers
function updateGlossLookups(slug) {
  const torahPath = path.join(DATA_DIR, "torah", `${slug}.json`);
  const glossPath = path.join(DATA_DIR, "word-glosses.json");

  const torah = JSON.parse(fs.readFileSync(torahPath, "utf-8"));
  const glosses = JSON.parse(fs.readFileSync(glossPath, "utf-8"));

  let addedToByWord = 0;

  for (const chapter of torah.chapters) {
    for (const verse of chapter.verses) {
      for (const word of verse.words) {
        if (word.lemma && glosses.byId[word.lemma]) {
          // If this word's consonantal form isn't in byWord, add it
          const consonantal = toConsonantal(word.textNiqqud || word.text);
          if (consonantal && !glosses.byWord[consonantal]) {
            const idEntry = glosses.byId[word.lemma];
            glosses.byWord[consonantal] = {
              id: word.lemma,
              gloss: idEntry.gloss,
              translit: idEntry.translit,
            };
            addedToByWord++;
          }
        }
      }
    }
  }

  if (addedToByWord > 0) {
    fs.writeFileSync(glossPath, JSON.stringify(glosses), "utf-8");
    console.log(`  Added ${addedToByWord} new byWord entries from ${slug}`);
  }
}

// Main
console.log("=== OSHB Integration ===\n");

const books = Object.keys(BOOK_MAP);
for (const slug of books) {
  processBook(slug);
}

console.log("\n=== Updating word-glosses.json ===\n");

for (const slug of books) {
  updateGlossLookups(slug);
}

console.log("\nDone!");
