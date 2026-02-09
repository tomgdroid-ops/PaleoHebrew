/**
 * Master build script: orchestrates all data generation.
 *
 * Usage: npx tsx scripts/build-all.ts
 *
 * This downloads and transforms:
 * 1. Torah text from Sefaria API
 * 2. Strong's Hebrew dictionary from GitHub
 *
 * The letter-meanings.json is hand-authored and already in data/.
 */

import { execSync } from "child_process";
import * as path from "path";

const SCRIPTS_DIR = __dirname;

function run(scriptName: string) {
  const scriptPath = path.join(SCRIPTS_DIR, scriptName);
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Running: ${scriptName}`);
  console.log("=".repeat(60));

  try {
    execSync(`npx tsx "${scriptPath}"`, {
      stdio: "inherit",
      cwd: path.resolve(SCRIPTS_DIR, ".."),
    });
  } catch (error) {
    console.error(`\nFailed: ${scriptName}`);
    throw error;
  }
}

async function main() {
  console.log("=== Paleo-Hebrew Decoder: Full Data Build ===");
  console.log(`Started at: ${new Date().toISOString()}\n`);

  // Step 1: Build Strong's data (faster, needed by Torah script potentially)
  run("build-strongs-data.ts");

  // Step 2: Build Torah data (slower, makes API calls)
  run("build-torah-data.ts");

  console.log(`\n${"=".repeat(60)}`);
  console.log("All data builds complete!");
  console.log(`Finished at: ${new Date().toISOString()}`);
}

main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
