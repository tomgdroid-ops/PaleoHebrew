/**
 * Build script: Download and transform Strong's Hebrew Dictionary.
 *
 * Source: OpenScriptures strongs repo on GitHub
 * File: hebrew/strongs-hebrew-dictionary.js (JS variable assignment containing JSON object)
 * Output: data/strongs.json
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "..", "data");
const OUTPUT_FILE = path.join(DATA_DIR, "strongs.json");

const STRONGS_URL =
  "https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js";

function stripNikkud(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, "");
}

function normalizeFinals(text: string): string {
  const finals: Record<string, string> = {
    "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ",
  };
  return [...text].map((ch) => finals[ch] || ch).join("");
}

function extractConsonants(text: string): string[] {
  const consonantal = normalizeFinals(stripNikkud(text));
  const hebrewRange = /[\u05D0-\u05EA]/;
  return [...consonantal].filter((ch) => hebrewRange.test(ch));
}

interface StrongsRawEntry {
  lemma?: string;
  xlit?: string;
  pron?: string;
  derivation?: string;
  strongs_def?: string;
  kjv_def?: string;
}

interface StrongsOutput {
  id: string;
  word: string;
  wordConsonantal: string;
  transliteration: string;
  pos: string;
  definition: string;
  rootLetters: string[];
}

/**
 * Extract part of speech from the definition text.
 */
function extractPos(entry: StrongsRawEntry): string {
  const def = (entry.strongs_def || "") + " " + (entry.derivation || "");
  if (def.match(/\ba prim(?:itive)? root/i)) return "verb";
  if (def.match(/\b(?:a |an )?(?:adj|adjective)/i)) return "adjective";
  if (def.match(/\bverb\b/i)) return "verb";
  if (def.match(/\b(?:a |an )?(?:noun|substantive)/i)) return "noun";
  if (def.match(/\bpronoun/i)) return "pronoun";
  if (def.match(/\bparticle/i)) return "particle";
  if (def.match(/\bpreposition/i)) return "preposition";
  if (def.match(/\bconjunction/i)) return "conjunction";
  if (def.match(/\badverb/i)) return "adverb";
  if (def.match(/\binterj/i)) return "interjection";
  return "noun"; // Default to noun for Hebrew lexical entries
}

async function main() {
  console.log("=== Building Strong's Data ===\n");

  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Download the JS file
  console.log("Downloading strongs-hebrew-dictionary.js...");
  const response = await fetch(STRONGS_URL);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  const jsContent = await response.text();
  console.log(`Downloaded ${(jsContent.length / 1024 / 1024).toFixed(1)} MB`);

  // Parse: the file is "var strongsHebrewDictionary = {...}"
  // Extract the JSON object by stripping the variable assignment
  const jsonStart = jsContent.indexOf("{");
  const jsonEnd = jsContent.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Could not find JSON object in the downloaded file");
  }

  const jsonStr = jsContent.substring(jsonStart, jsonEnd + 1);
  console.log("Parsing JSON...");

  const rawDict: Record<string, StrongsRawEntry> = JSON.parse(jsonStr);
  const entryCount = Object.keys(rawDict).length;
  console.log(`Parsed ${entryCount} entries`);

  // Transform entries
  const output: Record<string, StrongsOutput> = {};

  for (const [key, raw] of Object.entries(rawDict)) {
    // Normalize key to H#### format (the file uses H1, H2, etc.)
    const numStr = key.replace(/^H/, "");
    const num = parseInt(numStr, 10);
    if (isNaN(num)) continue;

    const id = `H${String(num).padStart(4, "0")}`;
    const word = raw.lemma || "";
    const consonantal = normalizeFinals(stripNikkud(word));

    output[id] = {
      id,
      word,
      wordConsonantal: consonantal,
      transliteration: raw.xlit || raw.pron || "",
      pos: extractPos(raw),
      definition: (raw.strongs_def || raw.kjv_def || "")
        .replace(/<[^>]*>/g, "") // Strip HTML tags
        .substring(0, 500),
      rootLetters: extractConsonants(word),
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

  const fileSize = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(1);
  console.log(`\nWrote ${Object.keys(output).length} entries to ${OUTPUT_FILE} (${fileSize} MB)`);
  console.log("=== Done! ===");
}

main().catch(console.error);
