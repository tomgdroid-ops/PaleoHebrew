import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary",
    title: "The Aleph Tav Project",
    description:
      "Interactive tools and original research for exploring the pictographic meanings, covenant markers, and hidden patterns within the Hebrew Scriptures.",
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
        <ThemeProvider>
          <HeaderNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
