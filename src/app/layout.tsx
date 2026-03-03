import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alephtavproject.com"),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "The Aleph Tav Project",
    template: "%s | The Aleph Tav Project",
  },
  description:
    "Explore the pictographic meanings hidden within ancient Hebrew words of the Torah. Interactive study tools, original research, and computational analysis of the Hebrew Scriptures.",
  openGraph: {
    title: "The Aleph Tav Project",
    description:
      "Interactive tools and original research for exploring the pictographic meanings, covenant markers, and hidden patterns within the Hebrew Scriptures.",
    siteName: "The Aleph Tav Project",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "The Aleph Tav Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Aleph Tav Project",
    description:
      "Interactive tools and original research for exploring the pictographic meanings, covenant markers, and hidden patterns within the Hebrew Scriptures.",
    images: ["/images/og-default.png"],
  },
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Aleph Tav Project",
  url: "https://alephtavproject.com",
  description:
    "Interactive tools and original research for exploring the pictographic meanings, covenant markers, and hidden patterns within the Hebrew Scriptures.",
  author: {
    "@type": "Person",
    name: "Tom Guadagno",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <JsonLd data={WEBSITE_JSONLD} />
        <ThemeProvider>
          <HeaderNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
