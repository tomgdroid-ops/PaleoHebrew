import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paleo-Hebrew Torah Decoder",
  description:
    "Explore the pictographic meanings hidden within ancient Hebrew words of the Torah. Decode each word into its Paleo-Hebrew letter forms and discover interpretive sentences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="border-b border-border bg-surface">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="paleo-glyph text-accent text-2xl">𐤀𐤁</span>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Paleo-Hebrew Torah Decoder
                </h1>
                <p className="text-xs text-muted">
                  Pictographic Word Analysis
                </p>
              </div>
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a
                href="/torah/genesis/1"
                className="text-muted hover:text-foreground transition-colors"
              >
                Read Torah
              </a>
              <a
                href="/about"
                className="text-muted hover:text-foreground transition-colors"
              >
                About
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
