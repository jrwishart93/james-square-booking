'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* -------------------------------------------------
   Helpers / Types
-------------------------------------------------- */
type LightboxItem = { src: string; alt: string } | null;
const glass =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]';

/* -------------------------------------------------
   Page
-------------------------------------------------- */
export default function UsefulInfoPage() {
  const [lightbox, setLightbox] = useState<LightboxItem>(null);

  const anchors = useMemo(
    () => [
      { id: 'factor-info', label: 'Factor Info' },
      { id: 'agm-2025', label: 'AGM 2025' },
      { id: 'voi-ebikes', label: 'Voi E-bikes' },
      { id: 'dalry-project', label: 'Dalry Project' },
      { id: 'world-buffet', label: 'World Buffet' },
      { id: 'bins', label: 'Bins' },
      { id: 'restaurants', label: 'Restaurants' },
      { id: 'groceries', label: 'Groceries' },
      { id: 'coffee', label: 'Coffee' },
    ],
    []
  );

  return (
    <main className="relative max-w-6xl mx-auto py-10 px-4">
      <BackgroundOrbs />

      {/* Sticky anchor nav on wide screens */}
      <nav className="hidden lg:block fixed top-24 right-6 z-20">
        <ul className={`${glass} p-3 space-y-1 text-sm`}>
          {anchors.map((a) => (
            <li key={`anchor-${a.id}`}>
              <a
                href={`#${a.id}`}
                className="block rounded px-2 py-1 hover:bg-white/50 dark:hover:bg-white/20"
              >
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero */}
      <section className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Useful Information
        </h1>
        <p className="mt-3 text-[color:var(--text-muted)] max-w-2xl mx-auto">
          Welcome to the James Square Useful Information page. This page covers access to the pool,
          gym and sauna, how waste and recycling works, who to contact if something goes wrong,
          what’s good nearby, and updates on local projects.
        </p>
      </section>

      {/* ---------------- Factor Info (loads immediately) ---------------- */}
      <SectionCard id="factor-info" title="Factor Information" initial>
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left: text */}
          <div className="flex-1 space-y-4">
            <p>
              <strong>Fior Asset &amp; Property</strong> manages the overall upkeep of James Square,
              including communal areas, landscaping, cleaning, and the shared facilities
              (pool, gym, sauna).
            </p>

            {/* General enquiries */}
            <div className="rounded-xl border p-4 bg-white/40 dark:bg-white/10 backdrop-blur">
              <h3 className="font-semibold">General enquiries</h3>
              <p>
                Email:{' '}
                <a
                  href="mailto:info@fiorassetandproperty.com"
                  className="underline font-medium"
                >
                  info@fiorassetandproperty.com
                </a>
              </p>
              <p>
                Phone:{' '}
                <a href="tel:+443334440586" className="underline font-medium">
                  0333 444 0586
                </a>
              </p>
              <p>
                Mobile:{' '}
                <a href="tel:+447548910618" className="underline font-medium">
                  07548 910618
                </a>
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border p-4 bg-white/40 dark:bg-white/10 backdrop-blur">
                <h3 className="font-semibold">Director</h3>
                <p className="font-medium">Pedrom Aghabala</p>
                <a
                  href="mailto:pedrom@fiorassetandproperty.com"
                  className="underline break-all"
                >
                  pedrom@fiorassetandproperty.com
                </a>
              </div>
              <div className="rounded-xl border p-4 bg-white/40 dark:bg-white/10 backdrop-blur">
                <h3 className="font-semibold">Manager (property queries)</h3>
                <p className="font-medium">Matthew</p>
                <a
                  href="mailto:matthew@fiorassetandproperty.com"
                  className="underline break-all"
                >
                  matthew@fiorassetandproperty.com
                </a>
              </div>
            </div>

            <div className="rounded-xl border p-4 bg-white/40 dark:bg-white/10 backdrop-blur">
              <h3 className="font-semibold">Address</h3>
              <address className="not-italic">
                Fior Asset &amp; Property<br />
                24 Canning Street<br />
                Edinburgh EH3 8EG
              </address>
            </div>
          </div>

          {/* Right: logo */}
          <div className="relative w-32 h-16 md:w-48 md:h-24 shrink-0">
            <Image
              src="/images/logo/fior-logo.png"
              alt="Fior Asset & Property logo"
              fill
              sizes="192px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </SectionCard>

      {/* ---------------- AGM 2025 ---------------- */}
      <Agm2025Section />

      {/* ---------------- Voi E-bikes (image shows fully) ---------------- */}
      <VoiEbikesCard />

      {/* ---------------- Dalry: Living Well Locally ---------------- */}
      <DalryProjectCard />

      {/* ---------------- Hot World Cuisine ---------------- */}
      <WorldBuffetCard />

      {/* ---------------- Bins & Waste (3-card grid) ---------------- */}
      <SectionCard id="bins" title="Bins & Waste">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BINS.map((bin, i) => (
            <motion.div
              key={`bin-${bin.title}`}
              className="flex flex-col overflow-hidden rounded-xl jqs-glass shadow-md"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="relative h-40 md:h-48 w-full overflow-hidden rounded-t-xl">
                <Image
                  src={bin.img}
                  alt={bin.title}
                  fill
                  sizes="(min-width:1024px) 300px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-1 gap-2">
                <h3 className="font-semibold">{bin.title}</h3>
                <p className="text-sm">{bin.text}</p>
                {bin.extra && <div className="text-sm">{bin.extra}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      {/* ---------------- Restaurants ---------------- */}
      <SectionCard id="restaurants" title="Restaurants">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESTAURANTS.map((r) => (
            <VenueCard key={`rest-${r.name}`} {...r} />
          ))}
        </div>
      </SectionCard>

      {/* ---------------- Groceries ---------------- */}
      <SectionCard id="groceries" title="Groceries">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GROCERIES.map((g) => (
            <VenueCard key={`groc-${g.name}`} {...g} />
          ))}
        </div>
      </SectionCard>

      {/* ---------------- Coffee ---------------- */}
      <SectionCard id="coffee" title="Coffee">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COFFEE.map((c) => (
            <VenueCard key={`coffee-${c.name}`} {...c} />
          ))}
        </div>
      </SectionCard>

      {/* ---- Site-wide image disclaimer (bottom of page) ---- */}
      <section className="mt-10">
        <div className={`${glass} p-4`}>
          <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">
            <strong>Image notice:</strong> All images on this website have been adapted using AI and are
            provided for reference purposes only. Original companies, organisations, or projects shown are
            not affiliated with or endorsed by this website.
          </p>
        </div>
      </section>

      {/* Lightbox (reserved) */}
      <AnimatePresence>
        {lightbox && (
          <motion.button
            aria-label="Close image"
            className="fixed inset-0 z-50 bg-black/70 p-6 flex items-center justify-center"
            onClick={() => setLightbox(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-4xl w-full"
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
            >
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                width={1600}
                height={1200}
                className="w-full h-auto rounded-2xl"
                priority
              />
              <div className="mt-2 text-center text-white/80 text-sm">{lightbox.alt}</div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}

/* -------------------------------------------------
   Section Components
-------------------------------------------------- */

function SectionCard({
  id,
  title,
  children,
  initial,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
  initial?: boolean;
}) {
  return (
    <motion.section
      id={id}
      className="mb-10"
      initial={initial ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      whileInView={initial ? undefined : { opacity: 1, y: 0 }}
      viewport={initial ? undefined : { once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
    >
      <div className={`${glass} p-5`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        {children}
      </div>
    </motion.section>
  );
}

function VenueCard({
  name,
  desc,
  address,
  phone,
  site,
  map,
  img,
}: {
  name: string;
  desc: string;
  address: string;
  phone?: string;
  site?: string;
  map: string;
  img: string;
}) {
  return (
    <article className={`${glass} p-4 flex gap-3`}>
      <div className="relative shrink-0 overflow-hidden rounded-xl w-32 h-24 md:w-40 md:h-28">
        <Image
          src={img}
          alt={`${name} front`}
          fill
          sizes="(min-width:1024px) 160px, 128px"
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm">{desc}</p>
        <p className="mt-1 text-xs text-[color:var(--text-muted)]">{address}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {phone && (
            <a className="underline" href={`tel:${phone.replace(/\s+/g, '')}`}>
              Call
            </a>
          )}
          {site && (
            <a className="underline" href={site} target="_blank" rel="noopener">
              Website
            </a>
          )}
          <a className="underline" href={map} target="_blank" rel="noopener">
            Map
          </a>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------
   AGM 2025
-------------------------------------------------- */

function Agm2025Section() {
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);

  return (
    <SectionCard id="agm-2025" title="James Square Proprietors Association AGM 2025" initial>
      <p className="text-[color:var(--text-muted)] text-sm">
        8pm Monday 8 September 2025 (via Zoom)
      </p>

      {/* Intro */}
      <p className="mt-3">
        The AGM is the annual meeting for owners and proprietors. Zoom links are
        emailed directly by Fior Asset &amp; Property Management. If you did not receive a link,
        please contact Fior to request assistance. The meeting covers financial updates, building
        maintenance, facilities management, and sets objectives for the next year.
      </p>

      {/* Brief summary card (always visible) */}
      <div className="mt-4 rounded-xl border p-4 bg-white/40 dark:bg-white/10 backdrop-blur">
        <ul className="list-disc ms-5 space-y-1 text-sm">
          <li>
            The 2025 AGM will cover finances, elections, pool and building issues, and objectives
            for the next year.
          </li>
          <li>Roof and render works remain the top long-term priority.</li>
          <li>The pool booking system and privacy will be reviewed.</li>
          <li>Owners will elect new committee members and block representatives.</li>
          <li>
            Major maintenance projects such as ceiling repairs, lift flooring and communal
            redecorations are on the agenda.
          </li>
        </ul>
      </div>

      {/* Card 1: 2025 AGM Agenda */}
      <div className="mt-4">
        <ExpandButton
          open={agendaOpen}
          setOpen={setAgendaOpen}
          labelWhenClosed="View full 2025 AGM agenda"
          labelWhenOpen="Hide 2025 AGM agenda"
          controlsId="agm-2025-agenda"
        />
        <AnimatePresence initial={false}>
          {agendaOpen && (
            <motion.div
              id="agm-2025-agenda"
              className={`${glass} mt-3 p-4`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <ul className="list-disc ms-5 space-y-1">
                <li>Introductions &amp; Apologies</li>
                <li>Ground Rules</li>
                <li>Chairperson’s report on 2024–25 activities</li>
                <li>
                  Financial report
                  <ul className="list-disc ms-5 mt-1 space-y-1">
                    <li>Budget vs actual spend</li>
                    <li>Current account balance</li>
                    <li>Roof/render fund balance</li>
                    <li>Debts</li>
                  </ul>
                </li>
                <li>Election of Committee Members and Block Representatives</li>
                <li>Pool booking system</li>
                <li>Pool window privacy</li>
                <li>
                  JSPA objectives for 2025–26
                  <ul className="list-disc ms-5 mt-1 space-y-1">
                    <li>Air source heat pump</li>
                    <li>Pool ceiling repair</li>
                    <li>Fire alarm system repair</li>
                    <li>Block 57 carpet and redecoration</li>
                    <li>Block 55 entrance</li>
                    <li>Block 45 entrance</li>
                    <li>Block 45/51 lift floor</li>
                    <li>Conservatory carpet replacement</li>
                    <li>Roof/render fund restart</li>
                    <li>Block 45/51 AOVs (automatic opening vents)</li>
                    <li>Repainting of solar reflective paint on roof</li>
                    <li>Broken pool windows</li>
                    <li>Caledonian Crescent entrance steps and fascia</li>
                    <li>Bushes beside front entrance</li>
                    <li>Painting of the walls around the car park</li>
                  </ul>
                </li>
                <li>Any other business</li>
                <li>Meeting closure</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card 2: Recap of 2023 AGM */}
      <div className="mt-4">
        <ExpandButton
          open={recapOpen}
          setOpen={setRecapOpen}
          labelWhenClosed="Read what was discussed at the 2023 AGM"
          labelWhenOpen="Hide 2023 AGM recap"
          controlsId="agm-2023-recap"
        />
        <AnimatePresence initial={false}>
          {recapOpen && (
            <motion.div
              id="agm-2023-recap"
              className={`${glass} mt-3 p-4 space-y-4`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <SectionText heading="Headline outcomes">
                <ul className="list-disc ms-5 space-y-1">
                  <li>Roof &amp; render confirmed as top capital priority; collections ongoing.</li>
                  <li>Outstanding debt across ~10 owners estimated £17–20k; 4 NOPLs registered.</li>
                  <li>
                    Pool policy adjusted: free use 10:00–17:00; bookings required outside those
                    hours.
                  </li>
                  <li>Staff pay increased by 5%, backdated to May 2023.</li>
                  <li>Insurance premiums escalated sharply (£29k in 2021 → £69k in 2023).</li>
                  <li>
                    Safety/maintenance items highlighted: pool ceiling, smoke vents, statutory
                    servicing.
                  </li>
                </ul>
              </SectionText>

              <SectionText heading="Finance & arrears">
                <ul className="list-disc ms-5 space-y-1">
                  <li>Live balance at AGM ~£89,928 (inflated by roof/render collections).</li>
                  <li>Funds transferred quarterly into ring-fenced block accounts.</li>
                  <li>
                    Arrears: ~10 owners in debt; shortfalls risk cuts or higher costs for others.
                  </li>
                  <li>Quarterly arrears/balance reporting requested.</li>
                </ul>
              </SectionText>

              <SectionText heading="Forward plan">
                <ul className="list-disc ms-5 space-y-1">
                  <li>Build reserves to ~90% before tendering roof/render works.</li>
                  <li>Investigate pool window seals and ceiling repairs.</li>
                  <li>Install smoke vents for Blocks 45 &amp; 51.</li>
                  <li>
                    Maintain statutory testing: lifts, pool water, dry risers, gates, pest control.
                  </li>
                </ul>
              </SectionText>

              <SectionText heading="Decisions made">
                <ul className="list-disc ms-5 space-y-1">
                  <li>Pool timetable change implemented.</li>
                  <li>Staff pay rise confirmed.</li>
                  <li>Safety works on pool ceiling instructed.</li>
                  <li>AOV installations scheduled.</li>
                  <li>Trinity to provide more transparent reporting.</li>
                </ul>
              </SectionText>

              <SectionText heading="Risks highlighted">
                <ul className="list-disc ms-5 space-y-1">
                  <li>Arrears remain the main financial risk.</li>
                  <li>Insurance inflation and claim handling quality.</li>
                  <li>Pool structural/water ingress concerns.</li>
                  <li>Roof/render project at risk from cost volatility.</li>
                </ul>
              </SectionText>

              <SectionText heading="Suggested follow-ups for 2024/25">
                <ul className="list-disc ms-5 space-y-1">
                  <li>Publish arrears dashboard quarterly.</li>
                  <li>Maintain roof/render tracker.</li>
                  <li>Keep insurance claims log.</li>
                  <li>Monitor pool bookings post-policy change.</li>
                  <li>Share maintenance calendar with residents.</li>
                  <li>Switch to WhatsApp Community for owner comms.</li>
                  <li>Track AOV installation progress.</li>
                </ul>
              </SectionText>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Participation panel (always visible) */}
      <div className="mt-4 rounded-xl border p-4 bg-white/40 dark:bg-white/10 backdrop-blur">
        <h3 className="text-lg font-semibold">Share Your Views</h3>
        <p className="text-sm mt-1">
          If you cannot attend the AGM, you can still contribute by sharing your views or suggesting ideas.
        </p>

        <Link
          href="/message-board"
          aria-label="Give Feedback or Share Your Opinion on the Message Board"
          className={[
            'mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl',
            'jqs-glass border shadow-md',
            'text-sm font-medium',
            'hover:brightness-105 active:scale-[0.99] transition',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30',
          ].join(' ')}
        >
          <span>Give Feedback / Share Your Opinion</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------
   Voi E-bikes
   (Image renders fully using object-contain)
-------------------------------------------------- */

function VoiEbikesCard() {
  const [open, setOpen] = useState(false);
  return (
    <SectionCard id="voi-ebikes" title="Voi E-bikes Arrive in Edinburgh">
      <p className="text-[color:var(--text-muted)] -mt-2 mb-3 text-sm">
        Trial cycle hire scheme launched September 2025
      </p>

      <p className="mb-4">
        Voi has launched a trial e-bike hire scheme in Edinburgh. James Square and Caledonian Crescent
        are within the designated operating area, and bikes have already been placed outside the Co-op.
        The scheme uses dockless e-bikes that can be picked up and left anywhere in the city’s operating
        zone using the Voi app.
      </p>

      {/* Full image visible: object-contain */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl jqs-glass shadow-md bg-white/60 dark:bg-white/10">
        <Image
          src="/images/area/voi-bike.png"
          alt="Voi e-bikes stationed in Dalry area, Edinburgh"
          fill
          sizes="(min-width:1024px) 900px, 100vw"
          className="object-contain"
        />
      </div>

      {/* Expand / Collapse */}
      <div className="mt-4">
        <ExpandButton
          open={open}
          setOpen={setOpen}
          labelWhenClosed="Read full details"
          labelWhenOpen="Hide details"
          controlsId="voi-details"
        />
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="voi-details"
              className="mt-4 space-y-5"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SectionText heading="Launch and pricing">
                The scheme began in September 2025, following an official launch event attended by
                Transport and Environment Convener Cllr Stephen Jenkinson and Voi UK General Manager
                James Bolton. A typical 20-minute ride costs £2.20 on pay-as-you-go. Day passes,
                multi-day passes and discounted bundles are also available. Unlocking is free, and
                the standard per-minute rate in Edinburgh is £0.11.
              </SectionText>

              <SectionText heading="Discounts and concessions">
                Voi has introduced a wide range of discounts for groups including those on low incomes,
                people with disabilities, residents over 60, blue light workers, veterans, students and
                apprentices. Full details on fares, concessions and promotions are available on the Voi
                website.
              </SectionText>

              <SectionText heading="Scheme scale and trial period">
                Around 50 e-bikes are available in the city centre during the initial phase. Feedback will
                guide an expansion to around 800 e-bikes citywide. The contract runs for two years, with an
                option to extend for up to 18 months, and operates at no cost to the Council.
              </SectionText>

              <SectionText heading="Background">
                Edinburgh’s previous cycle hire network (the Serco-run Just Eat Bikes, 2018–2021)
                closed due to vandalism and costs of £1.8m. Voi’s scheme has been designed with lessons
                learned in mind, including more durable bikes equipped with GPS tracking. Similar Voi
                services run in London, Oxford, Liverpool, Barcelona and Vienna.
              </SectionText>

              <SectionText heading="Why it matters">
                The new scheme supports Edinburgh’s active travel strategy by giving residents and
                visitors a healthier, low-emission way to get around. It complements public transport,
                improves city centre connectivity and reduces congestion.
              </SectionText>

              <SectionText heading="Download the app">
                <ul className="list-disc ms-5 space-y-1">
                  <li>
                    <a
                      className="text-blue-600 hover:underline"
                      href="https://apps.apple.com/app/id1457268497"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Voi on iOS (App Store)
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-blue-600 hover:underline"
                      href="https://play.google.com/store/apps/details?id=io.voiapp.voi"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Voi on Android (Google Play)
                    </a>
                  </li>
                </ul>
              </SectionText>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------
   Dalry Project
-------------------------------------------------- */

function DalryProjectCard() {
  const [open, setOpen] = useState(false);
  return (
    <SectionCard id="dalry-project" title="Dalry: Living Well Locally (Edinburgh Council Project)" initial>
      <p className="text-[color:var(--text-muted)] text-sm">Results updated 10 January 2025</p>

      <p className="mt-2">
        This City of Edinburgh Council project aims to make Dalry greener, healthier and easier to
        move around. Proposals include wider pavements, safer junctions, protected cycle routes,
        more trees and planting, and new seating. A traffic filter at Haymarket is being considered
        to help reduce through-traffic while maintaining access for residents, deliveries and
        businesses.
      </p>

      {/* Two concept images */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <figure className="relative w-full h-64 overflow-hidden rounded-xl jqs-glass shadow">
          <Image
            src="/images/area/dalry-concept.png"
            alt="Dalry Junction new layout concept"
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </figure>
        <figure className="relative w-full h-64 overflow-hidden rounded-xl jqs-glass shadow">
          <Image
            src="/images/area/caledonian-crescent-concept.png"
            alt="Caledonian Crescent concept design"
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
          />
        </figure>
      </div>

      {/* Image disclaimer directly under the visuals */}
      <p className="mt-2 text-xs text-[color:var(--text-muted)]">
        These visuals have been AI-generated based on concept ideas from the Edinburgh Council Dalry
        project. They are illustrative only, and the final project design may differ.
      </p>

      {/* Expand / collapse */}
      <div className="mt-4">
        <ExpandButton open={open} setOpen={setOpen} controlsId="dalry-details" />
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="dalry-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                <SectionText heading="The Council asked">
                  The Council sought views on proposals to improve Dalry and its town centre. The concept
                  design was based on earlier feedback. Posters, wraps and leaflets were delivered; the
                  consultation was promoted via press and social media. Public events were held and the team
                  met many groups. 767 people responded online.
                </SectionText>
                <SectionText heading="Locals responses">
                  The town centre proposal received 49% opposition, 46% support and 5% neutral. Supporters
                  liked people-first changes; concerns focused on a traffic filter, moving loading/parking to
                  side streets and business impact. One-way side streets had mixed views. There were also
                  concerns about pressure on Caledonian Road and blockages.
                </SectionText>
                <SectionText heading="What engagement showed">
                  Residents inside the area were more supportive. People who walk, cycle or use public
                  transport were more positive than those who mainly drive. Businesses raised delivery and
                  passing-trade concerns. Younger respondents tended to be more supportive.
                </SectionText>
                <SectionText heading="Next steps">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Investigate impact of a Haymarket traffic filter.</li>
                    <li>Review where to widen pavements.</li>
                    <li>Consider more loading bays while minimising parking loss.</li>
                    <li>Re-examine one-way system in the Caledonians and Orwells.</li>
                    <li>Ensure best practice for bus stop bypasses and protected junctions.</li>
                  </ul>
                  <p className="mt-2">
                    Further funding is being sought to continue design work, with community feedback incorporated.
                  </p>
                </SectionText>
                <p className="pt-2">
                  <a
                    className="text-blue-600 hover:underline"
                    href="https://consultationhub.edinburgh.gov.uk/sfc/dalry-living-well-locally/"
                    target="_blank"
                    rel="noopener"
                  >
                    View full project details on the Council website
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------
   World Buffet
-------------------------------------------------- */

function WorldBuffetCard() {
  const [open, setOpen] = useState(false);
  return (
    <SectionCard id="world-buffet" title="Hot World Cuisine Buffet on Dalry Road" initial>
      <p className="text-[color:var(--text-muted)] text-sm">
        Status: Permission granted by Council planners
      </p>

      <p className="mt-2">
        An all you can eat buffet restaurant, Hot World Cuisine, has been granted permission to open
        at 118 to 126 Dalry Road, near Fountain Park and Haymarket Station. The plan includes a bin
        store to address odour concerns. The venue is expected to create around 20 jobs across full
        and part time roles, and will provide 168 covers. No alcohol will be sold, served or
        consumed on the premises. The brand already operates in Glasgow and Paisley.
      </p>

      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl jqs-glass shadow mt-4">
        <Image
          src="/images/area/world-buffet.jpg"
          alt="Hot World Cuisine Dalry Road venue under construction"
          fill
          sizes="(min-width:1024px) 100vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Expand / collapse */}
      <div className="mt-4">
        <ExpandButton open={open} setOpen={setOpen} controlsId="world-buffet-details" />
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="world-buffet-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                <SectionText heading="Overview">
                  Hot World Cuisine has been granted permission to open an all you can eat buffet
                  restaurant at 118 to 126 Dalry Road. The site is close to Fountain Park and
                  Haymarket Station. A bin store will be introduced to address odour concerns.
                </SectionText>
                <SectionText heading="Capacity and jobs">
                  The restaurant will offer a total of 168 covers and is expected to create
                  approximately 20 jobs across full and part time general staff roles.
                </SectionText>
                <SectionText heading="Licensing and operations">
                  The proposal did not involve licensing requirements because no alcohol will be
                  sold, served or consumed within the premises.
                </SectionText>
                <SectionText heading="Operator background">
                  Hot World Cuisine currently operates in Glasgow and Paisley, offering a wide
                  selection of international dishes.
                </SectionText>
                <SectionText heading="Location and local context">
                  The unit sits on Dalry Road near Fountain Park and Haymarket Station with strong
                  public transport connections.
                </SectionText>
                <SectionText heading="Notes for residents">
                  Planning permission has been granted and a dedicated bin store forms part of the
                  plan to manage odour. Construction activity is underway. No alcohol licence is
                  being sought.
                </SectionText>
                <p className="pt-2">
                  <a
                    className="text-blue-600 hover:underline"
                    href="https://www.facebook.com/hotworldcuisineglasgow/posts/hello-edinburgh-its-getting-hot-in-here-%EF%B8%8F-work-has-begun-on-our-newest-buffet-si/714884084221369/"
                    target="_blank"
                    rel="noopener"
                  >
                    Learn more about this venue
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------
   Small Reusable Bits
-------------------------------------------------- */

function ExpandButton({
  open,
  setOpen,
  labelWhenClosed = 'Read full details',
  labelWhenOpen = 'Hide details',
  controlsId = 'expander',
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  labelWhenClosed?: string;
  labelWhenOpen?: string;
  controlsId?: string;
}) {
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-controls={controlsId}
      className="px-4 py-2 rounded-xl bg-black/80 text-white hover:bg-black transition"
    >
      {open ? labelWhenOpen : labelWhenClosed}
    </button>
  );
}

function SectionText({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-semibold">{heading}</h3>
      <div className="mt-1 text-sm md:text-base">{children}</div>
    </div>
  );
}

/* -------------------------------------------------
   Data blocks
-------------------------------------------------- */

const BINS = [
  {
    title: 'Everyday Waste',
    text:
      'General landfill bins are at the rear car park through the archway. Bin chutes in Blocks 51 and 45 are for tied sacks only. Large bags must go to outdoor bins. No rubbish should be left in stairwells or corridors.',
    img: '/images/buildingimages/waste-bins.jpeg',
  },
  {
    title: 'Recycling',
    text:
      'Recycling bins are at the front of James Square on Caledonian Crescent at the corner with Orwell Terrace. Separate bins are provided for glass, paper, plastics and cans.',
    img: '/images/buildingimages/outside-bins.png',
  },
  {
    title: 'Bulky Items & Electricals',
    text:
      'Nearest household waste and recycling center: Bankhead Avenue, EH11 4EA; Mon–Fri 08:00–19:30; Sat–Sun 08:00–18:00. Tel: 0131 529 3030.',
    extra: (
      <a
        href="https://www.edinburgh.gov.uk/recycling-3/household-waste-recycling-centres"
        target="_blank"
        rel="noopener"
        className="text-blue-600 hover:underline"
      >
        edinburgh.gov.uk — Recycling Centres
      </a>
    ),
    img: '/images/buildingimages/sighthill-waste-image.png',
  },
];

const RESTAURANTS = [
  {
    name: 'First Coast',
    desc:
      'Modern Scottish bistro with fresh, seasonal menus in a relaxed, welcoming setting.',
    address: '97–101 Dalry Road, EH11 2AB',
    phone: '+441313134404',
    site: 'https://first-coast.co.uk',
    map: 'https://maps.app.goo.gl/AmhsMkzahv44ko1e8?g_st=ipc',
    img: '/images/venues/first-coast-front.png',
  },
  {
    name: 'La Casa',
    desc: 'Tapas and mezze with Mediterranean flavours; lively and inviting.',
    address: '103–105 Dalry Road, EH11 2AB',
    phone: '01313372875',
    site: 'https://la-casa-restaurant.co.uk',
    map: 'https://maps.app.goo.gl/bubDdGhPAbQaJPkD8?g_st=ipc',
    img: '/images/venues/la-casa-front.png',
  },
  {
    name: 'Locanda De Gusti',
    desc: 'Neapolitan Italian dishes prepared with fresh ingredients in a homely setting.',
    address: '102 Dalry Road, EH11 2DW',
    phone: '+441313468800',
    site: 'https://locandadegusti.com',
    map: 'https://maps.app.goo.gl/N1WB5xvQWjd4nvSq6?g_st=ipc',
    img: '/images/venues/locanda-front.png',
  },
  {
    name: 'Kuzina',
    desc:
      'Welcoming Greek eatery with authentic dishes from souvlaki and moussaka to salads and mezze.',
    address: '84 Dalry Road, EH11 2AX',
    phone: '01312256066',
    site: 'https://kuzinaedinburgh.co.uk',
    map: 'https://maps.app.goo.gl/ZnUcb9Acp74yWd1T7?g_st=ipc',
    img: '/images/venues/kuzina-front.png',
  },
  {
    name: 'Mia Italian Kitchen',
    desc:
      'Pizzas, pastas and traditional dishes served by friendly Italian staff.',
    address: '96 Dalry Road, EH11 2AX',
    phone: '01316291750',
    site: 'https://mia-restaurant.co.uk',
    map: 'https://maps.app.goo.gl/gT6npc6BMHzTq8739?g_st=ipc',
    img: '/images/venues/mia-italian-front.png',
  },
  {
    name: 'The Fountain',
    desc:
      'Classic pub grub like fish and chips, pies and burgers in a convivial atmosphere.',
    address: '131 Dundee Street, EH11 1AX',
    site: 'https://fountainbar.co.uk',
    map: 'https://maps.app.goo.gl/sTSyoFAYQptRSyaW8?g_st=ipc',
    img: '/images/venues/the-fountain-front.png',
  },
  {
    name: 'Kebabish',
    desc:
      'Pakistani and Indian cuisine with chargrilled kebabs, aromatic curries and fresh naan.',
    address: '128 Dalry Road, EH11 2EZ',
    phone: '01313373371',
    site: 'https://ko-edinburgh.co.uk',
    map: 'https://maps.app.goo.gl/sXkyaW5stYCtbATw8?g_st=ipc',
    img: '/images/venues/kebabish-front.png',
  },
  {
    name: 'Sushiya',
    desc:
      'Cosy Japanese spot specialising in sushi and sashimi with handcrafted rolls.',
    address: '93 Dalry Road, EH11 2AB',
    phone: '+447340888780',
    site: 'https://sushiya-jp.com',
    map: 'https://maps.app.goo.gl/1owzMordTrvdpUvEA?g_st=ipc',
    img: '/images/venues/sushiya-front.png',
  },
];

const GROCERIES = [
  {
    name: 'Lidl',
    desc: 'Discount supermarket; affordable groceries and fresh bakery.',
    address: 'Dalry Road, EH11 2EF',
    map: 'https://maps.app.goo.gl/Hh46iSbbhCAVHGu4A?g_st=ipc',
    img: '/images/lidl-front.png',
  },
  {
    name: 'Co-Op Food',
    desc: 'Convenience store, open late; good for essentials.',
    address: '114 Dalry Road, EH11 2EZ',
    map: 'https://maps.app.goo.gl/rBzUKwdusLq3GLDw5?g_st=ipc',
    img: '/images/venues/coop-front.png',
  },
  {
    name: 'Tesco Express',
    desc: 'Smaller format Tesco for top-up shops.',
    address: '78–82 Haymarket Terrace, EH12',
    map: 'https://maps.app.goo.gl/kreRFxGswvmMdd9F9?g_st=ipc',
    img: '/images/venues/tesco-front.png',
  },
  {
    name: 'Sainsbury’s Local',
    desc: 'Convenient branch on Dundee Street.',
    address: '81–85 Dundee Street, EH11 1AW',
    map: 'https://maps.app.goo.gl/B4cYp64Vji41puFi8?g_st=ipc',
    img: '/images/venues/sainsburys-front.png',
  },
  {
    name: 'Scotmid',
    desc: 'Local Scottish chain; similar to Co-Op.',
    address: '112 Dundee Street, Edinburgh',
    map: 'https://maps.app.goo.gl/hzU9Ywv8fah8DUxJ9?g_st=ipc',
    img: '/images/venues/scotmid-front.png',
  },
];

const COFFEE = [
  {
    name: 'Roasters',
    desc: 'Locally roasted coffee in a relaxed setting.',
    address: '58 Dalry Road, EH11 2AY',
    phone: '01312593073',
    site: 'https://the-roasters.co.uk',
    map: 'https://maps.app.goo.gl/dbRhj9TqNGVq4tJSA?g_st=ipc',
    img: '/images/venues/roasters-front.png',
  },
  {
    name: 'Throat Punch',
    desc: 'Community-focused café known for excellent flat whites.',
    address: '30 Dalry Road, EH11 2BA',
    phone: '07984983066',
    site: 'https://throatpunch.co.uk',
    map: 'https://maps.app.goo.gl/uedsBb2w7xQFvUZ88?g_st=ipc',
    img: '/images/venues/throatpunch.png',
  },
  {
    name: 'Not Just Coffee',
    desc: 'Cosy artisan coffee with homemade cakes.',
    address: '165–167 Dalry Road, EH11 2EA',
    phone: '07766904442',
    map: 'https://maps.app.goo.gl/EvGBTx5XApScaCta8?g_st=ipc',
    img: '/images/venues/not-just-coffee.png',
  },
  {
    name: 'Chapter One',
    desc: 'Vegan micro-roastery; women-coop sourced beans.',
    address: '107–109 Dalry Road, EH11 2DR',
    phone: '+447900075632',
    site: 'https://chapterone.coffee',
    map: 'https://maps.app.goo.gl/2JR9yCGdRuj57yPC6?g_st=ipc',
    img: '/images/venues/chapter-one.png',
  },
  {
    name: 'Black Sheep Coffee (Haymarket)',
    desc: 'Bold blends, smoothies and pastries; dog friendly.',
    address: '8 Haymarket Square, EH3 8RY',
    phone: '+442039886994',
    site: 'https://blacksheepcoffee.co.uk',
    map: 'https://maps.app.goo.gl/nozosckyPm6eULsR7?g_st=ipc',
    img: '/images/venues/black-sheep.png',
  },
];

/* -------------------------------------------------
   Background Orbs
-------------------------------------------------- */
function BackgroundOrbs() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-[34rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,255,255,0.6), rgba(255,255,255,0))',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-24 size-[30rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,255,255,0.5), rgba(255,255,255,0))',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.8 }}
      />
    </>
  );
}