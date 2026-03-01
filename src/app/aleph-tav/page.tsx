import type { Metadata } from "next";
import AlephTavStudy from "./AlephTavStudy";

export const metadata: Metadata = {
  title: "The Aleph Tav Study - Paleo-Hebrew Torah Decoder",
  description:
    "Explore how the Aleph Tav covenant marker appears and disappears before biblical names in correlation with covenant events throughout the Hebrew Bible.",
};

export default function AlephTavPage() {
  return <AlephTavStudy />;
}
