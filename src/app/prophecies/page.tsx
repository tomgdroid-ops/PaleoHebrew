import type { Metadata } from "next";
import ProphecyHero from "@/components/prophecies/ProphecyHero";
import PropheciesGrid from "./PropheciesGrid";

export const metadata: Metadata = {
  title: "Messianic Prophecies",
  description:
    "37 Old Testament messianic prophecies examined alongside their New Testament fulfillment and historical evidence from the Dead Sea Scrolls, ancient codices, and archaeology.",
  openGraph: {
    title: "Messianic Prophecies | The Aleph Tav Project",
    description:
      "37 messianic prophecies with fulfillment and historical evidence.",
    images: ["/images/prophecies/prophecies-hero.png"],
  },
};

export default function PropheciesPage() {
  return (
    <div>
      <ProphecyHero />
      <PropheciesGrid />
    </div>
  );
}
