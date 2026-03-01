/**
 * clean-torah-data.js
 *
 * Cleans Torah JSON data:
 * 1. Strips HTML entities (&thinsp;, &nbsp;, etc.) from word text fields
 * 2. Removes paragraph markers ({פ}, {ס}) from word text
 * 3. Splits paseq-merged words (two words joined with ׀) into separate entries
 * 4. Strips sof-pasuq (׃) from text fields
 * 5. Re-indexes word positions after splits
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "data", "torah");
const BOOKS = ["genesis", "exodus", "leviticus", "numbers", "deuteronomy"];

/**
 * Strip HTML entities from text.
 */
function stripHtml(text) {
  return text
    .replace(/&thinsp;/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Strip paragraph markers and sof-pasuq from text.
 */
function stripMarkers(text) {
  return text
    .replace(/\{פ\}/g, "")
    .replace(/\{ס\}/g, "")
    .replace(/׃/g, "")       // sof-pasuq
    .replace(/\u05C3/g, "")   // sof-pasuq (Unicode)
    .trim();
}

/**
 * Strip nikkud to get consonantal text.
 */
function stripNikkud(text) {
  return text.replace(/[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4-\u05C7]/g, "");
}

/**
 * Normalize final forms to standard.
 */
function normalizeFinals(text) {
  const map = { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" };
  return [...text].map(ch => map[ch] || ch).join("");
}

function toConsonantal(text) {
  let cleaned = stripNikkud(text);
  cleaned = cleaned.replace(/[^\u05D0-\u05EA]/g, "");
  return normalizeFinals(cleaned);
}

/**
 * Check if a word contains a paseq and should be split.
 */
function hasPaseq(textNiqqud) {
  return textNiqqud && textNiqqud.includes("׀");
}

/**
 * Split a paseq-merged word into two words.
 * The paseq mark (׀) separates two distinct words.
 */
function splitPaseqWord(word) {
  const niqqud = word.textNiqqud;
  // Split on the paseq mark (with optional thin spaces around it)
  const parts = niqqud.split(/\s*׀\s*/);

  if (parts.length < 2) return [word]; // Can't split

  // Clean each part
  const results = [];
  for (let i = 0; i < parts.length; i++) {
    const partNiqqud = stripHtml(stripMarkers(parts[i])).trim();
    if (!partNiqqud) continue;

    const partConsonantal = toConsonantal(partNiqqud);
    if (!partConsonantal) continue;

    results.push({
      text: partConsonantal,
      textNiqqud: partNiqqud,
      lemma: i === 0 ? word.lemma : "", // First part keeps the original lemma (if any)
      morph: i === 0 ? word.morph : "",
      position: 0, // Will be re-indexed later
    });
  }

  return results.length > 0 ? results : [word];
}

/**
 * Process a single book.
 */
function processBook(slug) {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const torah = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let splits = 0;
  let cleaned = 0;

  for (const chapter of torah.chapters) {
    for (const verse of chapter.verses) {
      const newWords = [];

      for (const word of verse.words) {
        // Check for paseq merge
        if (hasPaseq(word.textNiqqud)) {
          const splitWords = splitPaseqWord(word);
          if (splitWords.length > 1) {
            splits++;
          }
          for (const sw of splitWords) {
            // Clean each split word
            sw.text = stripMarkers(stripHtml(sw.text)).trim();
            sw.textNiqqud = stripMarkers(stripHtml(sw.textNiqqud)).trim();
            if (sw.text) newWords.push(sw);
          }
        } else {
          // Clean the word
          const origText = word.text;
          word.text = stripMarkers(stripHtml(word.text)).trim();
          word.textNiqqud = stripMarkers(stripHtml(word.textNiqqud || "")).trim();
          if (word.text !== origText) cleaned++;
          if (word.text) newWords.push(word);
        }
      }

      // Re-index positions
      newWords.forEach((w, i) => { w.position = i; });
      verse.words = newWords;

      // Also clean the verse-level text
      if (verse.text) verse.text = stripMarkers(stripHtml(verse.text)).trim();
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(torah, null, 2), "utf-8");
  console.log(`${slug}: ${splits} paseq splits, ${cleaned} words cleaned`);
}

// Main
console.log("=== Cleaning Torah Data ===\n");
for (const slug of BOOKS) {
  processBook(slug);
}
console.log("\nDone! Run integrate-oshb.js again to get Strong's IDs for split words.");
