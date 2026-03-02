import type { Metadata } from "next";
import AlephTavStudy from "./AlephTavStudy";

export const metadata: Metadata = {
  title: "Aleph Tav Study",
  description:
    "Explore how the Aleph Tav covenant marker appears and disappears before biblical names in correlation with covenant events throughout the Hebrew Bible.",
};

export default function AlephTavPage() {
  return <AlephTavStudy />;
}
