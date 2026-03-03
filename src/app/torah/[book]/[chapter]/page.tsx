import { notFound } from "next/navigation";
import { getBooksMeta, getChapter, getLetterMeanings, getWordGlosses, getCuratedSentences } from "@/lib/data-loader";
import type { Metadata } from "next";
import ChapterView from "./ChapterView";
import BookHero from "@/components/BookHero";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ book: string; chapter: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book, chapter } = await params;
  const books = getBooksMeta();
  const bookMeta = books.find((b) => b.slug === book.toLowerCase());
  const bookName = bookMeta?.name || book;

  return {
    title: `${bookName} ${chapter} - Torah Decoder`,
    description: `Explore the pictographic meanings of Hebrew words in ${bookName} chapter ${chapter}. Click any word to see its Paleo-Hebrew letter breakdown and interpretive sentences.`,
  };
}

export default async function TorahChapterPage({ params }: PageProps) {
  const { book, chapter: chapterStr } = await params;
  const chapterNum = parseInt(chapterStr, 10);

  if (isNaN(chapterNum)) notFound();

  const books = getBooksMeta();
  const bookSlug = book.toLowerCase();
  const bookMeta = books.find((b) => b.slug === bookSlug);

  if (!bookMeta) notFound();
  if (chapterNum < 1 || chapterNum > bookMeta.chapters) notFound();

  const chapterData = getChapter(bookSlug, chapterNum);
  if (!chapterData) notFound();

  const letterMeanings = getLetterMeanings();
  const wordGlosses = getWordGlosses();
  const curatedSentences = getCuratedSentences();

  return (
    <>
      <BookHero bookSlug={bookSlug} variant="chapter" />
      <div className="max-w-[1600px] mx-auto px-4 pt-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: bookMeta!.name, href: `/torah/${bookSlug}/1` },
            { label: `Chapter ${chapterNum}` },
          ]}
        />
      </div>
      <ChapterView
        chapter={chapterData}
        books={books}
        bookSlug={bookSlug}
        letterMeanings={letterMeanings}
        wordGlosses={wordGlosses}
        curatedSentences={curatedSentences}
      />
    </>
  );
}
