import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import WaxwingGallery from './WaxwingGallery';
import HistoryStory from './HistoryStory';

const description =
  'Stories from James Square, Edinburgh: the history of Dalry and the development, and the winter Bohemian waxwings visited.';

export const metadata: Metadata = {
  title: 'Stories | James Square',
  description,
  metadataBase: new URL('https://www.james-square.com'),
  alternates: { canonical: 'https://www.james-square.com/stories' },
  openGraph: {
    title: 'Stories from James Square',
    description,
    url: 'https://www.james-square.com/stories',
    type: 'article',
    images: [
      {
        url: 'https://www.james-square.com/images/buildingimages/Bird-3.JPG',
        width: 1200,
        height: 630,
        alt: 'Bohemian waxwings perched at James Square',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stories from James Square',
    description,
    images: ['https://www.james-square.com/images/buildingimages/Bird-3.JPG'],
  },
};

const glass =
  'jqs-glass rounded-2xl border border-white/20 bg-white/55 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)]';

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 pb-16">
      <Link
        href="/local"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Living here
      </Link>

      <header>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Stories from James Square</h1>
        <p className="mt-3 text-[color:var(--text-muted)]">
          The neighbourhood&rsquo;s past, and a few moments worth remembering.
        </p>
        <nav aria-label="Stories" className="mt-5 flex flex-wrap gap-2 text-sm">
          <a href="#winter-visitors" className="rounded-full border border-black/10 px-3.5 py-1.5 font-medium dark:border-white/15">
            Winter visitors
          </a>
          <a href="#history" className="rounded-full border border-black/10 px-3.5 py-1.5 font-medium dark:border-white/15">
            History of Dalry and James Square
          </a>
        </nav>
      </header>

      <article id="winter-visitors" className={`${glass} scroll-mt-24 space-y-5 p-5 sm:p-7`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
            December 2025
          </p>
          <h2 className="mt-1 text-2xl font-semibold">The winter the waxwings came</h2>
        </div>
        <p>
          In December 2025, James Square welcomed a small flock of Bohemian waxwings. These striking birds, known for
          their crests and soft colouring, are only occasional visitors to the UK and are usually seen when food
          becomes scarce in their usual northern habitats.
        </p>
        <p>
          You may have noticed birdwatchers with cameras around the square. They were photographing the waxwings
          feeding on the berry trees around the buildings.
        </p>

        <WaxwingGallery />

        <div className="space-y-1 text-center text-sm text-[color:var(--text-muted)]">
          <p>Photographs kindly shared by members of the Lothian Birdwatch Facebook group.</p>
          <a
            href="https://www.facebook.com/share/p/1APEUb9PqS/?mibextid=wwXIfr"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            View original post
          </a>
        </div>

        <div className="space-y-3 border-t border-black/10 pt-5 text-[color:var(--text-muted)] dark:border-white/10">
          <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">About waxwings</h3>
          <p>
            Waxwings are distinctive winter visitors recognised by their smooth plumage, crested heads and flashes of
            red and yellow on their wings.
          </p>
          <p>
            The birds seen at James Square were Bohemian waxwings, a species that breeds across the northern forests
            of Scandinavia and Russia. During some winters, food shortages push them further south in what are known
            as &ldquo;irruption years&rdquo;.
          </p>
          <p>
            These movements can bring large flocks into towns and cities, where berry trees provide an important food
            source. Seeing them locally is considered a special and relatively rare event.
          </p>
        </div>
      </article>

      <article id="history" className={`${glass} scroll-mt-24 space-y-6 p-5 sm:p-7`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">History</p>
          <h2 className="mt-1 text-2xl font-semibold">Dalry and James Square</h2>
          <p className="mt-2 text-[color:var(--text-muted)]">
            How Dalry changed from rural estate land to an industrial hub and residential neighbourhood, and the
            setting that shaped James Square.
          </p>
        </div>
        <HistoryStory />
        <p className="text-xs text-[color:var(--text-muted)]">
          Some historical images have been restored or adapted and are for illustration only.
        </p>
      </article>
    </div>
  );
}
