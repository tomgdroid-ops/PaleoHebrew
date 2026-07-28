/**
 * Pull the Romans 8:1 photographic plates into public/images/romans/.
 *
 *   npx tsx scripts/fetch-plates.ts
 *
 * Plates are optional — the homepage renders its own light fields and is
 * complete without them. Run this from a machine that can reach the CDN listed
 * in src/lib/plates.ts, then rebuild; the photographs layer in automatically.
 */
import fs from "node:fs";
import path from "node:path";

import { PLATES } from "../src/lib/plates";

async function main() {
  const outDir = path.join(process.cwd(), "public", "images", "romans");
  fs.mkdirSync(outDir, { recursive: true });

  let written = 0;
  let skipped = 0;

  for (const [key, def] of Object.entries(PLATES)) {
    const dest = path.join(process.cwd(), "public", def.file);

    if (!def.sourceUrl) {
      console.warn(`- ${key}: no sourceUrl recorded, skipping`);
      skipped++;
      continue;
    }
    if (fs.existsSync(dest)) {
      console.log(`- ${key}: already present`);
      skipped++;
      continue;
    }

    const response = await fetch(def.sourceUrl);
    if (!response.ok) {
      console.error(`! ${key}: ${response.status} ${response.statusText}`);
      skipped++;
      continue;
    }

    fs.writeFileSync(dest, Buffer.from(await response.arrayBuffer()));
    console.log(`+ ${key} -> ${def.file}`);
    written++;
  }

  console.log(`\n${written} written, ${skipped} skipped.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
