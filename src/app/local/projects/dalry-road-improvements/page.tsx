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

        <section className="rounded-3xl border border-amber-200/80 dark:border-amber-500/40 bg-amber-50/90 dark:bg-amber-950/30 p-6 sm:p-8 shadow-sm space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            Current Status
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Works continue around Dalry Road and Caledonian Crescent
          </h2>
          <p className="text-slate-700 dark:text-slate-300">
            Road improvement works are continuing around Dalry Road and Caledonian Crescent. A temporary closure of
            Telfer Subway is planned from Monday 15 June to Friday 19 June 2026 while nearby works are carried out.
          </p>
        </section>

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
                <li>
                  Original estimated completion: April 2026; works updates are continuing as the project progresses
                </li>
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

        <section className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Temporary Telfer Subway Closure
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Telfer Subway will be fully closed to both pedestrians and cyclists from Monday 15 June to Friday 19 June
              2026.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              The closure is required for safety and space constraints while works are carried out near the Caledonian
              Crescent entrance, including construction of a raised table and footway.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              A fully signed diversion route will be in place. Residents should allow additional time, especially when
              walking or cycling between James Square, Dalry Road, and Haymarket.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              What this means for James Square residents
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              If you normally use Telfer Subway to reach Dalry Road, Haymarket, or nearby bus and tram stops, plan ahead
              and follow the signed diversion during the closure period. The route may take longer on foot or by bike,
              so leave extra time for journeys and take care around temporary traffic management in the area.
            </p>
          </div>

          <details className="group rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-950/40 p-4 sm:p-5">
            <summary className="cursor-pointer text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View diversion map
            </summary>
            <div className="mt-4 space-y-4">
              <iframe
                src="/docs/survey/Caledonian Crescent Footpath Closure.pdf"
                title="Caledonian Crescent footpath closure diversion map"
                className="w-full min-h-[500px] rounded-2xl border border-slate-200/70 dark:border-slate-800/70"
              />
              <a
                href="/docs/survey/Caledonian Crescent Footpath Closure.pdf"
                className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Open diversion map PDF
              </a>
            </div>
          </details>
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
