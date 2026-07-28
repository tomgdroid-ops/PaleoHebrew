import fs from "node:fs";
import path from "node:path";

/**
 * Photographic plates for the Romans 8:1 homepage.
 *
 * Every act on the homepage renders a hand-built CSS "light field" — a layered
 * study of gradient light that carries the film grade on its own. A plate is an
 * OPTIONAL photographic layer that sits on top of that light field, underneath
 * the same grade and grain. The page is complete and cinematic without plates;
 * dropping the files in deepens it without a single code change.
 *
 * The frames below were generated with Higgsfield (Cinema Studio Image 2.5) as
 * one consistent series. `sourceUrl` is where each frame lives; run
 * `npm run fetch:plates` from a machine that can reach the CDN to pull them
 * into `public/images/romans/`.
 */

export type PlateKey = "void" | "chamberCold" | "chamberWarm" | "threshold" | "morning";

type PlateDef = {
  /** Public path, relative to /public. */
  file: string;
  width: number;
  height: number;
  /** Empty alt: plates are atmosphere. The narrative lives in the text. */
  alt: string;
  sourceUrl: string;
};

export const PLATES: Record<PlateKey, PlateDef> = {
  void: {
    file: "/images/romans/01-void.png",
    width: 2752,
    height: 1536,
    alt: "",
    sourceUrl:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3FM8ACNVpk7RWvwZxWXehZwE7hP/hf_20260728_114153_a45c61a0-3ba9-43e2-b953-63c9b89c89a9.png",
  },
  chamberCold: {
    file: "/images/romans/02-chamber-cold.png",
    width: 2752,
    height: 1536,
    alt: "",
    sourceUrl:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3FM8ACNVpk7RWvwZxWXehZwE7hP/hf_20260728_114159_cf63ca4f-b90d-470c-a6f4-b556ad7a6ab3.png",
  },
  // Generated image-to-image from chamberCold, so the two frames share a
  // composition and Act III can cross-fade one room against itself.
  chamberWarm: {
    file: "/images/romans/03-chamber-warm.png",
    width: 2752,
    height: 1536,
    alt: "",
    sourceUrl:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3FM8ACNVpk7RWvwZxWXehZwE7hP/hf_20260728_114840_2862b991-36f9-46d6-89a9-4c3505a9734e.png",
  },
  threshold: {
    file: "/images/romans/04-threshold.png",
    width: 3168,
    height: 1344,
    alt: "",
    sourceUrl:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3FM8ACNVpk7RWvwZxWXehZwE7hP/hf_20260728_114421_8a1b95ab-f795-417b-b3f3-e7ae8aef7ea0.png",
  },
  morning: {
    file: "/images/romans/05-morning.png",
    width: 2752,
    height: 1536,
    alt: "",
    sourceUrl:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3FM8ACNVpk7RWvwZxWXehZwE7hP/hf_20260728_114424_e7ebbfdb-3f0a-4a8e-9c1f-1c58dac0ee1f.png",
  },
};

/**
 * Resolve a plate, or `null` when the file has not been added yet. Called from
 * a Server Component, so this runs at build time and costs nothing at runtime.
 */
export function plate(key: PlateKey): PlateDef | null {
  const def = PLATES[key];
  const onDisk = path.join(process.cwd(), "public", def.file);
  return fs.existsSync(onDisk) ? def : null;
}
