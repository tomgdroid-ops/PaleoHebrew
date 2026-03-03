import type { MetadataRoute } from "next";
import { getBooksMeta } from "@/lib/data-loader";
import { prophecies } from "@/data/prophecies";

const BASE = "https://alephtavproject.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getBooksMeta();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/alphabet`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/stone-to-script`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/aleph-tav`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/research`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/research/beyond-ai`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/prophecies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const torahPages: MetadataRoute.Sitemap = books.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, i) => ({
      url: `${BASE}/torah/${book.slug}/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  const prophecyPages: MetadataRoute.Sitemap = prophecies.map((p) => ({
    url: `${BASE}/prophecies/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...torahPages, ...prophecyPages];
}
