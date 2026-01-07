import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

const pageTitle = 'Dalry Road & Caledonian Area Road Improvements';
const pageDescription =
  'Planned council road improvement works across Dalry Road and surrounding streets, including resurfacing and safer pedestrian crossings.';
const twitterDescription = 'Planned council works to improve roads and pedestrian access in the Dalry area.';
const pageUrl = 'https://www.james-square.com/local/projects/dalry-road-improvements';
const imageUrl = 'https://www.james-square.com/images/area/Road-works-Caledonian.PNG';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'article',
    images: [
      {
        url: imageUrl,
        width: 1536,
        height: 1024,
        alt: 'Roadworks sign on Dalry Road',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: twitterDescription,
    images: [imageUrl],
  },
};

export default function DalryRoadImprovementsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 sm:px-8 py-12">
      <div className="space-y-10">
        <Link
          href="/local#local-projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <span aria-hidden>←</span>
          Back to Local Projects
        </Link>

        <header className="space-y-6">
          <Image
            src="/images/area/Road-works-Caledonian.PNG"
            alt="Roadworks signage for the Dalry Road and Caledonian area"
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1024px) 960px, 100vw"
            className="w-full h-auto rounded-3xl border border-slate-200/70 dark:border-slate-800/70 object-contain"
          />

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100">
              {pageTitle}
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              The council are delivering the first phase of a road improvement project across Dalry Road and
              surrounding streets, combining scheduled maintenance with measures to improve walking and wheeling
              locally.
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Planned works</h2>
            <p className="text-slate-700 dark:text-slate-300">Affected streets include:</p>
            <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              <li>Dalry Road</li>
              <li>Caledonian Crescent</li>
              <li>Caledonian Place</li>
              <li>Caledonian Road</li>
              <li>Orwell Place</li>
              <li>Orwell Terrace</li>
            </ul>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p>Timescale:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Works began in early 2026</li>
                <li>Estimated completion: April 2026</li>
              </ul>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              To minimise disruption, the council are combining planned maintenance with improvements aimed at making
              streets safer and easier to navigate for pedestrians and wheelchair users.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Scope of works</h2>
            <p className="text-slate-700 dark:text-slate-300">The planned works include:</p>
            <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              <li>Resurfacing roads</li>
              <li>Removing street clutter</li>
              <li>Improving pedestrian safety at crossing points</li>
              <li>Installing continuous footways and raised tables</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
              During these works, only one road will be closed at a time. Where possible, parking and loading bays will
              be retained.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What are continuous footways?</h2>
          <p className="text-slate-700 dark:text-slate-300">
            Continuous footways raise the junction road surface to the same height as the pavement, with ramps for
            drivers. The surface matches the pavement to show that it continues across the entrance of the side road,
            giving visual priority to pedestrians. Side roads remain accessible to all vehicles.
          </p>
        </section>

        <Link
          href="/local#local-projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <span aria-hidden>←</span>
          Back to Local Projects
        </Link>
      </div>
    </main>
  );
}
