import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import AlphabetContent from "./AlphabetContent";
import ContinueExploring from "@/components/ContinueExploring";
import letterMeanings from "../../../data/letter-meanings.json";

export const metadata: Metadata = {
  title: "Hebrew Alphabet",
};

const SVG_NAME_MAP: Record<string, string> = {
  "א": "aleph", "ב": "bet", "ג": "gimel", "ד": "dalet",
  "ה": "hey", "ו": "vav", "ז": "zayin", "ח": "chet",
  "ט": "tet", "י": "yod", "כ": "kaf", "ל": "lamed",
  "מ": "mem", "נ": "nun", "ס": "samekh", "ע": "ayin",
  "פ": "pey", "צ": "tsade", "ק": "qof", "ר": "resh",
  "ש": "shin", "ת": "tav",
};

const CARD_BG_MAP: Record<string, string> = {
  "א": "aleph-ox.jpg", "ב": "bet-house.jpg", "ג": "gimel-camel.jpg",
  "ד": "dalet-door.jpg", "ה": "hey-window.jpg", "ו": "vav-nail.jpg",
  "ז": "zayin-sword.jpg", "ח": "chet-fence.jpg", "ט": "tet-serpent.jpg",
  "י": "yod-hand.jpg", "כ": "kaf-palm.jpg", "ל": "lamed-staff.jpg",
  "מ": "mem-water.jpg", "נ": "nun-seed.jpg", "ס": "samekh-shield.jpg",
  "ע": "ayin-eye.jpg", "פ": "pey-mouth.jpg", "צ": "tsade-hook.jpg",
  "ק": "qof-horizon.jpg", "ר": "resh-head.jpg", "ש": "shin-fire.jpg",
  "ת": "tav-mark.jpg",
};

export default function AlphabetPage() {
  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Hebrew Alphabet" }]} />

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">The Paleo-Hebrew Alphabet</h1>
          <p className="text-muted max-w-2xl mx-auto">
            The 22 letters of the Hebrew alphabet, each tracing back to an ancient
            pictograph. Every letter carries concrete meanings rooted in its
            original picture.
          </p>
        </div>
      </div>

      <AlphabetContent
        letters={letterMeanings as any}
        svgNameMap={SVG_NAME_MAP}
        cardBgMap={CARD_BG_MAP}
      />

      <div className="max-w-6xl mx-auto px-4">
        <ContinueExploring
          links={[
            { title: "From Stone to Script", description: "Trace the evolution of Hebrew writing from ancient pictographs to modern script.", href: "/stone-to-script" },
            { title: "Torah Decoder", description: "Click any Hebrew word to see its Paleo-Hebrew letter breakdown.", href: "/torah/genesis/1" },
          ]}
        />
      </div>
    </div>
  );
}
