/**
 * Build a condensed word-gloss map from Strong's dictionary.
 * Maps consonantal Hebrew text -> { id, gloss, transliteration }
 * This is a small file (~100KB) safe to ship to the client.
 */

import * as fs from "fs";
import * as path from "path";

interface StrongsEntry {
  id: string;
  word: string;
  wordConsonantal: string;
  transliteration: string;
  pos: string;
  definition: string;
  rootLetters: string[];
}

interface WordGloss {
  id: string;       // Strong's number
  gloss: string;    // Short English definition
  translit: string; // Academic transliteration
}

function shortenDefinition(def: string): string {
  if (!def) return "";
  // Take the first meaningful phrase
  // Strip leading articles and parentheticals
  let short = def
    .replace(/^\(.*?\)\s*/g, "")     // remove leading parentheticals
    .replace(/^(a |an |the )/i, ""); // strip leading article

  // Take text up to first semicolon, comma-separated-clause, or parenthetical
  const cut = short.search(/[;(]|,\s*(?:i\.e\.|especially|specifically|by)/);
  if (cut > 0) short = short.substring(0, cut).trim();

  // Limit length
  if (short.length > 30) {
    const spaceIdx = short.lastIndexOf(" ", 30);
    if (spaceIdx > 10) short = short.substring(0, spaceIdx);
  }

  // Clean trailing punctuation
  short = short.replace(/[,;:\s]+$/, "").trim();

  return short;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const strongsPath = path.join(DATA_DIR, "strongs.json");
const outputPath = path.join(DATA_DIR, "word-glosses.json");

const strongs: Record<string, StrongsEntry> = JSON.parse(
  fs.readFileSync(strongsPath, "utf-8")
);

// Build map: consonantal text -> best WordGloss
// If multiple Strong's entries share the same consonantal form, pick the most common one
const glossMap: Record<string, WordGloss> = {};

for (const [, entry] of Object.entries(strongs)) {
  const key = entry.wordConsonantal;
  if (!key) continue;

  const gloss = shortenDefinition(entry.definition);
  if (!gloss) continue;

  // Keep first entry per consonantal form (lower Strong's number = more common)
  if (!glossMap[key]) {
    glossMap[key] = {
      id: entry.id,
      gloss,
      translit: entry.transliteration,
    };
  }
}

// Also build a map by Strong's ID for direct lookup
const byId: Record<string, WordGloss> = {};
for (const [, entry] of Object.entries(strongs)) {
  const gloss = shortenDefinition(entry.definition);
  if (!gloss) continue;
  byId[entry.id] = {
    id: entry.id,
    gloss,
    translit: entry.transliteration,
  };
}

const output = { byWord: glossMap, byId };

fs.writeFileSync(outputPath, JSON.stringify(output));

const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
console.log(`Built word-glosses.json: ${Object.keys(glossMap).length} words by consonantal text, ${Object.keys(byId).length} by Strong's ID (${sizeKB} KB)`);
