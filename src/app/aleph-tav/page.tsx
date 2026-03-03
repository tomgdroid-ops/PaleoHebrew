import type { Metadata } from "next";
import AlephTavStudy from "./AlephTavStudy";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Aleph Tav Study",
  description:
    "Explore how the Aleph Tav covenant marker appears and disappears before biblical names in correlation with covenant events throughout the Hebrew Bible.",
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Aleph Tav Covenant Marker Study",
  description:
    "Explore how the Aleph Tav covenant marker appears and disappears before biblical names in correlation with covenant events throughout the Hebrew Bible.",
  author: { "@type": "Person", name: "Tom Guadagno" },
  publisher: { "@type": "Organization", name: "The Aleph Tav Project" },
};

export default function AlephTavPage() {
  return (
    <>
      <JsonLd data={ARTICLE_JSONLD} />
      <AlephTavStudy />
    </>
  );
}
