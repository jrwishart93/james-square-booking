'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Tabs from '@/components/Tabs';
import FireAction from '@/components/fire-action/FireAction';
import PageContainer from '@/components/layout/PageContainer';

/* -------------------------------------------------
   Helpers / Types
-------------------------------------------------- */
type LightboxItem = { src: string; alt: string } | null;
const TAB_IDS = ['about', 'projects', 'restaurants', 'groceries', 'coffee'] as const;
type TabId = (typeof TAB_IDS)[number];
const glass =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]';
const dockGlass =
  'bg-neutral-900/65 text-white backdrop-blur-xl shadow-[0_8px_26px_rgba(0,0,0,0.18)]';
const waxwingImages = [
  { src: '/images/buildingimages/Bird-1.JPG', alt: 'Waxwing perched on a branch at James Square' },
  { src: '/images/buildingimages/Bird-2.JPG', alt: 'Waxwing feeding among the berries near the apartments' },
  { src: '/images/buildingimages/Bird-3.JPG', alt: 'Close view of a waxwing showing its crest and colouring' },
  { src: '/images/buildingimages/Bird-4.JPG', alt: 'Waxwing flock resting in a berry tree at James Square' },
  { src: '/images/buildingimages/Bird-5.JPG', alt: 'Waxwing in flight above the trees at James Square' },
];
const carouselVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -32 : 32, opacity: 0 }),
};

function WaxwingCarousel({ onOpenLightbox }: { onOpenLightbox?: (item: LightboxItem) => void }) {
  const [index, setIndex] = useState(0);
  const directionRef = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = waxwingImages.length;

  const goTo = (next: number, direction: number) => {
    directionRef.current = direction;
    setIndex((next + total) % total);
  };

  const prev = () => goTo(index - 1, -1);
  const next = () => goTo(index + 1, 1);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        next();
      } else {
        prev();
      }
    }

    touchStart.current = null;
  };

  const currentImage = waxwingImages[index];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-2">
      <div
        className="group relative h-[240px] overflow-hidden rounded-xl sm:h-[340px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={directionRef.current}>
          <motion.div
            key={currentImage.src}
            custom={directionRef.current}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              sizes="(min-width:1280px) 720px, (min-width:768px) 80vw, 100vw"
              className={`h-full w-full rounded-xl object-contain ${onOpenLightbox ? 'cursor-zoom-in' : ''}`}
              priority={index === 0}
              onClick={() => onOpenLightbox?.(currentImage)}
              role={onOpenLightbox ? 'button' : undefined}
              tabIndex={onOpenLightbox ? 0 : -1}
              onKeyDown={(e) => {
                if (!onOpenLightbox) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenLightbox(currentImage);
                }
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-y-0 left-3 right-3 hidden items-center justify-between md:flex">
          <button
            type="button"
            aria-label="Previous waxwing photo"
            onClick={prev}
            className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition opacity-0 group-hover:opacity-100 hover:text-white focus:outline-none focus-visible:opacity-100"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next waxwing photo"
            onClick={next}
            className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition opacity-0 group-hover:opacity-100 hover:text-white focus:outline-none focus-visible:opacity-100"
          >
            →
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {waxwingImages.map((img, i) => (
          <button
            key={img.src}
            aria-label={`Go to waxwing photo ${i + 1}`}
            onClick={() => goTo(i, i > index ? 1 : -1)}
            className={`h-2 w-2 rounded-full transition ${
              i === index ? 'bg-neutral-900 dark:bg-white/90' : 'bg-neutral-400/50 dark:bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Page
-------------------------------------------------- */
export default function UsefulInfoPage() {
  const [lightbox, setLightbox] = useState<LightboxItem>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showFireAction, setShowFireAction] = useState(false);
  const [showWaxwingDetails, setShowWaxwingDetails] = useState(false);
  const [activeSection, setActiveSection] = useState('pool-access');
  const [scrollingDown, setScrollingDown] = useState(false);
  const lastScrollY = useRef(0);
  const tabs = useMemo(
    () => [
      { id: 'about', label: 'About James Square' },
      { id: 'projects', label: 'Local Projects' },
      { id: 'restaurants', label: 'Restaurants' },
      { id: 'groceries', label: 'Groceries' },
      { id: 'coffee', label: 'Coffee' },
    ],
    []
  );

  const aboutAnchors = useMemo(
    () => [
      { id: 'pool-access', label: 'Swimming Pool Access' },
      { id: 'factor', label: 'Factor' },
      { id: 'caretaker', label: 'Caretaker' },
      { id: 'bins', label: 'Bins' },
      { id: 'fire', label: 'Fire' },
      { id: 'winter-visitors', label: 'Winter Visitors' },
      { id: 'history', label: 'History' },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState<TabId>('about');

  useEffect(() => {
    if (window.location.hash === '#local-projects') {
      setActiveTab('projects');
      return;
    }

    const saved = window.localStorage.getItem('useful-info-tab');
    if (saved === 'area') {
      setActiveTab('projects');
      return;
    }
    if (TAB_IDS.includes(saved as TabId)) {
      setActiveTab(saved as TabId);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('useful-info-tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'about') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.15, 0.35, 0.5, 0.65, 0.8, 1],
      }
    );

    aboutAnchors.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [aboutAnchors, activeTab]);

  useEffect(() => {
    if (activeTab !== 'about') return undefined;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const directionDown = currentY > lastScrollY.current;
      setScrollingDown(directionDown);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const handleAnchorClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageContainer>
      <div className="relative py-10 pb-24 lg:pb-32">
      <BackgroundOrbs />

      {/* Hero */}
      <section className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Useful Information
        </h1>
        <p className="mt-3 text-[color:var(--text-muted)] max-w-2xl mx-auto">
          Use these tabs to quickly find building guidance for James Square or explore nearby
          transport, food, and projects in the local area.
        </p>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as TabId)} className="mt-6" />
      </section>

      <div className="space-y-10">
        {activeTab === 'about' && (
          <div
            id="about-panel"
            role="tabpanel"
            aria-labelledby="about-tab"
            className="space-y-10"
          >
            <p className="text-[color:var(--text-muted)] max-w-3xl mx-auto text-center">
              Welcome to the James Square Useful Information page. This page covers access to the pool,
              gym and sauna, how waste and recycling works, who to contact if something goes wrong,
              what’s good nearby, and updates on local projects.
            </p>

            {/* ---------------- Swimming Pool Access ---------------- */}
            <SectionCard id="pool-access" headingId="swimming-pool-access" title="Swimming Pool Access" initial>
              <div className="space-y-6">
                <p>
                  The swimming pool, gym and sauna area is located at the North West side of James Square and
                  can be accessed in two ways.
                </p>

                <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr] items-start">
                  <div className="space-y-4">
                    <p>
                      Residents accessing the pool from within the main building should follow the internal
                      signage, which will guide you through the appropriate internal door.
                    </p>
                    <p>
                      There is also a separate external entrance for everyone else. From the car park, head
                      towards the main gates and you will find the pool entrance door under the archway near to
                      the electric gates.
                    </p>
                  </div>

                  <figure className="relative w-full h-64 overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                    <Image
                      src="/images/buildingimages/pool_from_outside.png"
                      alt="External view of the pool entrance at James Square"
                      fill
                      sizes="(min-width:1024px) 460px, 100vw"
                      className="object-cover"
                    />
                  </figure>
                </div>

                <div className="grid gap-4 md:grid-cols-2 items-start">
                  <figure className="relative w-full h-56 overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                    <Image
                      src="/images/buildingimages/pool_door.png"
                      alt="Pool entrance door and keypad access at James Square"
                      fill
                      sizes="(min-width:1024px) 420px, 100vw"
                      className="object-cover"
                    />
                  </figure>

                  <div className="space-y-3">
                    <p>
                      If you are new to the development, please make sure you have both a valid key fob and the
                      access code, as these are required to enter the pool area.
                    </p>
                    <p>
                      If you need a key fob or the access code, please contact either your landlord or the
                      previous resident or owner in the first instance. If you still need assistance, contact the
                      factor and or Jimmy, the caretaker, who can assist with access arrangements.
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ---------------- Factor Info (loads immediately) ---------------- */}
            <SectionCard id="factor" headingId="factor-information" title="Factor Information" initial>
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

            {/* ---------------- Caretaker ---------------- */}
            <SectionCard id="caretaker" headingId="caretaker" title="Caretaker">
              <div className="space-y-4">
                <p>
                  James Square has a resident caretaker, Jimmy, who works most weekday mornings and early
                  afternoons.
                </p>

                <p>
                  Jimmy is responsible for the running and maintenance of the pool systems, general maintenance
                  of communal areas, and can assist with the replacement or purchase of key fobs and main
                  entrance door keys.
                </p>

                <div className="space-y-2">
                  <p className="font-semibold">Office location</p>
                  <p>
                    Jimmy’s office is located at 65A, between the main entrance and the path to Telfer Subway,
                    accessed via a small set of stairs. There is a ring doorbell on the front of the door.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Please note</p>
                  <p>
                    Jimmy is not responsible for issues within private dwellings, the delivery or handling of
                    packages, or short-term let enquiries.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* ---------------- Bins & Waste (3-card grid) ---------------- */}
            <SectionCard id="bins" headingId="bins-and-waste" title="Bins & Waste">
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

            <SectionCard id="fire" headingId="fire-action" title="Fire Action">
              <div className="space-y-4">
                <p className="text-[color:var(--text-muted)]">
                  What to do in the event of a fire within James Square. Follow these quick instructions and open the
                  detailed guide when you need the full poster and assembly point map.
                </p>
                <div className="space-y-4">
                  <FireAction showDetails={showFireAction} />
                  <button
                    type="button"
                    onClick={() => setShowFireAction((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/40 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    {showFireAction ? 'Hide Fire Action' : 'Read More'}
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id="winter-visitors"
              headingId="winter-visitors-at-james-square"
              title="Winter Visitors at James Square"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <p>
                    This December, James Square welcomed a small flock of Bohemian waxwings. These striking birds,
                    known for their crests and soft colouring, are only occasional visitors to the UK and are usually
                    seen when food becomes scarce in their usual northern habitats.
                  </p>
                  <p>
                    You may have noticed birdwatchers with cameras around the square. They were capturing images of the
                    waxwings feeding on the berry trees around the buildings.
                  </p>
                </div>

                <WaxwingCarousel onOpenLightbox={setLightbox} />

                <div className="space-y-2 text-center">
                  <p className="text-sm text-[color:var(--text-muted)]">
                    Photographs kindly shared by members of the Lothian Birdwatch Facebook group.
                  </p>
                  <a
                    href="https://www.facebook.com/share/p/1APEUb9PqS/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center text-sm font-medium text-[color:var(--text-muted)] underline underline-offset-4 transition hover:text-white"
                  >
                    View original post
                  </a>
                </div>

                <div className="space-y-3 border-t border-white/30 pt-4 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowWaxwingDetails((prev) => !prev)}
                    aria-expanded={showWaxwingDetails}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/40 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    {showWaxwingDetails ? 'Hide details' : 'Read more: About Waxwings'}
                  </button>

                  <AnimatePresence initial={false}>
                    {showWaxwingDetails && (
                      <motion.div
                        key="waxwing-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pt-2 text-[color:var(--text-muted)]">
                          <p>
                            Waxwings are distinctive winter visitors recognised by their smooth plumage, crested heads
                            and flashes of red and yellow on their wings.
                          </p>
                          <p>
                            The birds seen at James Square were Bohemian Waxwings, a species that breeds across the
                            northern forests of Scandinavia and Russia. During some winters, food shortages push them
                            further south in what are known as “irruption years”.
                          </p>
                          <p>
                            These movements can bring large flocks into towns and cities, where berry trees provide an
                            important food source. Seeing them locally is considered a special and relatively rare
                            event.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id="history"
              headingId="history-of-james-square-and-the-local-area"
              title="History of James Square and the Local Area"
            >
              <div className="space-y-6">
                <p className="text-[color:var(--text-muted)]">
                  A short history of Dalry’s transformation from rural estate land to the industrial hub and
                  residential neighbourhood that shaped James Square.
                </p>
                <button
                  type="button"
                  onClick={() => setShowHistory((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/40 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  {showHistory ? 'Read Less' : 'Read More'}
                </button>

                {showHistory && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Dalry before urban development</h3>
                      <p>
                        Until the late eighteenth century, Dalry remained largely rural and lay beyond Edinburgh’s
                        formal town boundary. The area consisted primarily of agricultural land associated with
                        Dalry House, a seventeenth-century estate that stood as the principal settlement in the
                        district. Although Dalry sat on the western approach to the city and was crossed by routes
                        linking Edinburgh with the west, it remained sparsely developed for much of this period.
                      </p>
                      <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                        <Image
                          src="/images/area/dalry-house.jpeg"
                          alt="Dalry House and surrounding rural landscape"
                          width={1200}
                          height={800}
                          sizes="(min-width:1024px) 800px, 100vw"
                          className="h-auto w-full object-contain"
                        />
                      </figure>
                      <p>
                        This rural character began to change decisively in the early nineteenth century as
                        Edinburgh expanded westward. The transformation of Dalry was driven by improvements in
                        transport infrastructure and the rapid growth of industrial employment across the
                        western edge of the city.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Railways and industrial expansion</h3>
                      <p>
                        The opening of Haymarket Station in 1842 marked a fundamental shift in Dalry’s
                        development. Haymarket quickly became Edinburgh’s second major railway hub, surrounded by
                        extensive sidings, goods yards, and branch lines spreading west and south. The arrival of
                        the railway brought industry with it, reshaping the area both physically and socially.
                      </p>
                      <p>
                        Large numbers of skilled and semi-skilled workers were employed by the Caledonian Railway,
                        while nearby industries such as brewing, rubber manufacturing, and whisky distilling
                        expanded to take advantage of rail access. The Caledonian Distillery, which opened in
                        1885, became one of the most prominent industrial landmarks in the district and a
                        defining feature of Dalry’s western skyline.
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                          <Image
                            src="/images/area/Caledonian_Distillery.jpg"
                            alt="Caledonian Distillery exterior"
                            width={1200}
                            height={800}
                            sizes="(min-width:1024px) 800px, 100vw"
                            className="h-auto w-full object-contain"
                          />
                        </figure>
                        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                          <Image
                            src="/images/area/caledonian-distillery-from-above.jpg"
                            alt="Aerial view of the Caledonian Distillery"
                            width={1200}
                            height={800}
                            sizes="(min-width:1024px) 800px, 100vw"
                            className="h-auto w-full object-contain"
                          />
                        </figure>
                      </div>
                      <p>
                        This concentration of employment created immediate demand for housing within walking
                        distance of workplaces, prompting rapid residential development across the surrounding
                        streets.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Victorian housing and Caledonian Crescent</h3>
                      <p>
                        From the 1860s onward, Dalry was systematically urbanised. Landowners and speculative
                        builders laid out new streets of sandstone tenements designed to accommodate the better-paid
                        segment of the working population, particularly those employed by the railways and nearby
                        industries. Caledonian Crescent formed part of this late-Victorian expansion and was
                        developed primarily during the 1870s and 1880s.
                      </p>
                      <p>
                        The street was characterised by substantial stone tenements arranged in a regular and
                        planned layout, reflecting a deliberate approach to urban development rather than piecemeal
                        growth. Its proximity to Dalry Road, Haymarket Station, and major employers made it a
                        practical and desirable location. While Caledonian Crescent was not conceived as elite
                        housing, it was solid, respectable, and well situated within the expanding city.
                      </p>
                      <p>
                        The establishment of supporting community infrastructure reinforced Dalry’s status as a
                        settled neighbourhood. The opening of the Dalry Public Baths in 1897 provided a significant
                        civic amenity and marked the transition of the area from an industrial fringe to a fully
                        established urban district.
                      </p>
                      <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                        <Image
                          src="/images/area/dalry-public-baths.png"
                          alt="Dalry Public Baths building"
                          width={1200}
                          height={800}
                          sizes="(min-width:1024px) 800px, 100vw"
                          className="h-auto w-full object-contain"
                        />
                      </figure>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Dalry Road as a transport and commercial spine</h3>
                      <p>
                        Dalry Road functioned as the main artery through the district, carrying horse trams, heavy
                        pedestrian traffic, and a dense mix of shops, schools, churches, and public houses. The road
                        linked residential streets such as Caledonian Crescent to places of work, commerce, and
                        worship, forming the social and economic backbone of the area.
                      </p>
                      <p>
                        The opening of a local railway station on Dalry Road in 1900 further strengthened its
                        importance, although the station later closed in 1962. By the early twentieth century, Dalry
                        had been fully absorbed into Edinburgh’s urban fabric, with little remaining trace of its
                        earlier rural character.
                      </p>
                      <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                        <Image
                          src="/images/area/clear-dalry-primary.png"
                          alt="Dalry Road and surrounding district"
                          width={1200}
                          height={800}
                          sizes="(min-width:1024px) 800px, 100vw"
                          className="h-auto w-full object-contain"
                        />
                      </figure>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Post-war decline and land clearance</h3>
                      <p>
                        Following the Second World War, Dalry entered a period of transition. Rail use declined,
                        heavy industry contracted, and large areas of railway land became redundant. This was
                        particularly evident south of Dalry Road and west of Haymarket, where extensive sidings and
                        yards were gradually abandoned.
                      </p>
                      <p>
                        By the 1960s, significant tracts of land had become derelict or underused, creating physical
                        gaps within the urban fabric and weakening connections between long-established residential
                        streets.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">The West Approach Road and physical separation</h3>
                      <p>
                        During the late 1960s and early 1970s, Edinburgh adopted a modern traffic strategy focused on
                        improving vehicular access to the city centre. This resulted in the construction of the West
                        Approach Road, much of which followed former railway alignments.
                      </p>
                      <p>
                        The impact on Dalry was profound. Large areas of former rail land were cleared, established
                        pedestrian routes were severed, and parts of the neighbourhood became enclosed by major
                        infrastructure. While the new road improved access to the city centre, it also left behind
                        isolated parcels of land adjacent to streets such as Caledonian Crescent.
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                          <Image
                            src="/images/area/clear - west approach road.JPG"
                            alt="Construction of the West Approach Road"
                            width={1200}
                            height={800}
                            sizes="(min-width:1024px) 800px, 100vw"
                            className="h-auto w-full object-contain"
                          />
                        </figure>
                        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                          <Image
                            src="/images/area/West Approach Road from above.png"
                            alt="West Approach Road from above"
                            width={1200}
                            height={800}
                            sizes="(min-width:1024px) 800px, 100vw"
                            className="h-auto w-full object-contain"
                          />
                        </figure>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">The context for James Square</h3>
                      <p>
                        By the late 1970s and early 1980s, Dalry presented a clear contrast. It remained close to the
                        city centre and well served by transport, yet bore the physical legacy of industrial decline
                        and large-scale infrastructure projects. Former railway and service land near Caledonian
                        Crescent became increasingly attractive for private residential redevelopment as demand for
                        city-centre living returned.
                      </p>
                      <p>It was within this setting that James Square was conceived.</p>
                      <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                        <Image
                          src="/images/area/James-Square-Outside-1980s.PNG"
                          alt="James Square exterior in the 1980s"
                          width={1200}
                          height={800}
                          sizes="(min-width:1024px) 800px, 100vw"
                          className="h-auto w-full object-contain"
                        />
                      </figure>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">James Square: development and design</h3>
                      <p>
                        James Square, located on Caledonian Crescent, was constructed in the mid-1980s as a private
                        residential development. It was designed from the outset for private ownership and was not a
                        council or housing association project. Unusually for its time, the development incorporated
                        shared amenities such as a private swimming pool, gym, and sauna, reflecting a shift toward
                        amenity-led urban living.
                      </p>
                      <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
                        <Image
                          src="/images/area/James-Square-old.png"
                          alt="James Square in the mid-1980s"
                          width={1200}
                          height={800}
                          sizes="(min-width:1024px) 800px, 100vw"
                          className="h-auto w-full object-contain"
                        />
                      </figure>
                      <p>
                        The inward-facing courtyard layout responded directly to its surroundings, turning away
                        from the West Approach Road and adjacent infrastructure in favour of a contained communal
                        space. Public records do not definitively identify the developer or architect, nor do they
                        clearly establish whether the site replaced specific buildings or previously cleared land.
                        This lack of detailed archival record is typical of many private developments from the 1980s.
                      </p>
                      <p>
                        James Square exists as a direct consequence of earlier changes to the area. The decline of
                        the railways, the clearance of industrial land, and the construction of the West Approach
                        Road created the conditions that made this form of redevelopment both possible and desirable.
                        Today, James Square sits quietly within a neighbourhood shaped by more than a century of
                        layered urban change.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ---- Site-wide image disclaimer (bottom of page) ---- */}
            <section className="mt-2">
              <div className={`${glass} p-4`}>
                <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">
                  <strong>Image notice:</strong> All images on this website have been adapted using AI and are
                  provided for reference purposes only. Original companies, organisations, or projects shown are
                  not affiliated with or endorsed by this website.
                </p>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'projects' && (
          <div
            id="projects-panel"
            role="tabpanel"
            aria-labelledby="projects-tab"
            className="space-y-10"
          >
            <div id="local-projects" />

            {/* ---------------- Friends of Dalry Community Park ---------------- */}
            <DalryCommunityParkCard />

            {/* ---------------- Dalry Road Improvements ---------------- */}
            <DalryRoadImprovementsCard />

            {/* ---------------- Voi E-bikes (image shows fully) ---------------- */}
            <VoiEbikesCard />

            {/* ---------------- Dalry: Living Well Locally ---------------- */}
            <DalryProjectCard />

            {/* ---------------- Hot World Cuisine ---------------- */}
            <WorldBuffetCard />
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div
            id="restaurants-panel"
            role="tabpanel"
            aria-labelledby="restaurants-tab"
            className="space-y-10"
          >
            <SectionCard id="restaurants" headingId="restaurants" title="Restaurants">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESTAURANTS.map((r) => (
                  <VenueCard key={`rest-${r.name}`} {...r} />
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'groceries' && (
          <div
            id="groceries-panel"
            role="tabpanel"
            aria-labelledby="groceries-tab"
            className="space-y-10"
          >
            <SectionCard id="groceries" headingId="groceries" title="Groceries">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GROCERIES.map((g) => (
                  <VenueCard key={`groc-${g.name}`} {...g} />
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'coffee' && (
          <div
            id="coffee-panel"
            role="tabpanel"
            aria-labelledby="coffee-tab"
            className="space-y-10"
          >
            <SectionCard id="coffee" headingId="coffee" title="Coffee">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COFFEE.map((c) => (
                  <VenueCard key={`coffee-${c.name}`} {...c} />
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </div>

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

      <AnimatePresence>
        {activeTab === 'about' && (
          <FloatingDock
            anchors={aboutAnchors}
            activeSection={activeSection}
            onNavigate={handleAnchorClick}
            emphasize={scrollingDown}
          />
        )}
      </AnimatePresence>
      </div>
    </PageContainer>
  );
}

/* -------------------------------------------------
   Section Components
-------------------------------------------------- */

function SectionCard({
  id,
  headingId,
  title,
  children,
  initial,
}: {
  id?: string;
  headingId?: string;
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
          <h2 id={headingId} className="text-2xl font-semibold">
            {title}
          </h2>
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

type DockProps = {
  anchors: { id: string; label: string }[];
  activeSection: string;
  onNavigate: (id: string) => void;
  emphasize: boolean;
};

function FloatingDock({ anchors, activeSection, onNavigate, emphasize }: DockProps) {
  return (
    <motion.nav
      className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-3 sm:px-6 scale-95 sm:scale-100"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: emphasize ? 1 : 0.92, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.28 }}
      aria-label="About page quick navigation"
    >
      <div
        className={`${dockGlass} flex items-center gap-1 rounded-full px-2.5 py-2 text-xs sm:text-sm sm:px-3 sm:py-2.5 backdrop-saturate-150`}
        role="list"
      >
        {anchors.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={`dock-${id}`}
              type="button"
              onClick={() => onNavigate(id)}
              className={`relative rounded-full px-2.5 py-2 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${
                isActive
                  ? 'text-white'
                  : 'text-white/70 hover:text-white/90 focus-visible:text-white'
              }`}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`Jump to ${label}`}
            >
              <span className="block leading-none">{label}</span>
              {isActive && (
                <span className="absolute inset-x-2 -bottom-1 block h-0.5 rounded-full bg-white/80" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}

/* -------------------------------------------------
   Friends of Dalry Community Park
-------------------------------------------------- */

function DalryCommunityParkCard() {
  return (
    <SectionCard
      id="dalry-community-park"
      headingId="friends-of-dalry-community-park"
      title="Friends of Dalry Community Park"
      initial
    >
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[0.6rem] font-semibold text-emerald-700 dark:text-emerald-200">
          Community meeting
        </span>
        <span>Monday 12 January</span>
      </div>

      <p className="mt-3 text-sm text-[color:var(--text-muted)]">
        Friends of Dalry Community Park are hosting a community meeting to follow up on issues raised last
        year and discuss next steps for the park.
      </p>

      <a
        href="/local/projects/dalry-community-park"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View project details
        <span aria-hidden>→</span>
      </a>
    </SectionCard>
  );
}

/* -------------------------------------------------
   Dalry Road Improvements
-------------------------------------------------- */

function DalryRoadImprovementsCard() {
  return (
    <SectionCard
      id="dalry-road-improvements"
      headingId="dalry-road-improvements"
      title="Dalry Road & Caledonian Area Road Improvements"
    >
      <p className="mt-3 text-sm text-[color:var(--text-muted)]">
        Council-led road and pedestrian improvement works across Dalry Road and surrounding streets, running through
        to spring 2026.
      </p>

      <a
        href="/local/projects/dalry-road-improvements"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View project details
        <span aria-hidden>→</span>
      </a>
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
    <SectionCard id="voi-ebikes" headingId="voi-ebikes-arrive-in-edinburgh" title="Voi E-bikes Arrive in Edinburgh">
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
    <SectionCard
      id="dalry-project"
      headingId="dalry-living-well-locally-edinburgh-council-project"
      title="Dalry: Living Well Locally (Edinburgh Council Project)"
      initial
    >
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <SectionCard
      id="world-buffet"
      headingId="hot-world-cuisine-buffet-dalry-road"
      title="Hot World Cuisine Buffet – Dalry Road"
      initial
    >
      <p className="mt-2">
        It’s looking like the renovations for the new buffet restaurant at the end of Dalry Road are
        now largely complete, with the opening currently expected in early 2026. Once open, Hot
        World Cuisine Buffet is anticipated to offer a large international all-you-can-eat buffet,
        with pricing likely to vary depending on the day.
      </p>
      <p className="mt-2">
        As with any new opening, details such as opening times and prices are based on the latest
        available information and may change once the restaurant is fully up and running.
      </p>

      <WorldBuffetCarousel />

      <div className="mt-6">
        <ExpandButton
          open={detailsOpen}
          setOpen={setDetailsOpen}
          labelWhenClosed="Read Full Details"
          labelWhenOpen="Hide Details"
          controlsId="world-buffet-details"
        />
        <AnimatePresence initial={false}>
          {detailsOpen && (
            <motion.div
              id="world-buffet-details"
              className="mt-4 space-y-6 border-l border-white/30 pl-4 text-[color:var(--text-muted)]"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SectionText heading="Planning and Background">
                <ul className="list-disc ms-5 space-y-2">
                  <li>
                    Planning permission was granted in early 2025 for the new buffet restaurant on
                    Dalry Road.
                  </li>
                  <li>
                    The venue is expected to offer around 168 covers and create about 20 jobs in the
                    area.
                  </li>
                  <li>
                    There is already an established and successful Hot World Cuisine restaurant on
                    Paisley Road in Glasgow, known for a wide variety of international buffet options
                    and daily specials.
                  </li>
                </ul>
              </SectionText>

              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-[color:var(--text-primary)]">
                  Expected Opening Times &amp; Prices
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-white/20 bg-white/50 dark:bg-white/10 p-4">
                    <p className="font-medium text-[color:var(--text-primary)]">Mon – Thu</p>
                    <ul className="mt-2 space-y-1">
                      <li>12:00pm – 10:00pm</li>
                      <li>Adult: £21.99</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/50 dark:bg-white/10 p-4">
                    <p className="font-medium text-[color:var(--text-primary)]">Fri – Sat</p>
                    <ul className="mt-2 space-y-1">
                      <li>12:00pm – 10:00pm</li>
                      <li>Adult: £23.99</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/50 dark:bg-white/10 p-4">
                    <p className="font-medium text-[color:var(--text-primary)]">Sunday</p>
                    <ul className="mt-2 space-y-1">
                      <li>12:30pm – 10:00pm</li>
                      <li>Includes Sunday Roast</li>
                      <li>Adult: £23.99</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4">
                  (Child under height line (145cm) are half price)
                </p>
                <p className="mt-2 text-sm">
                  Times and prices are subject to change once the restaurant officially opens.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}

function WorldBuffetCarousel() {
  const slides = [
    {
      src: '/images/venues/hot-world-edi-outside.png',
      alt: 'Hot World Cuisine Buffet exterior',
      width: 1600,
      height: 900,
    },
    {
      src: '/images/venues/hot-world-edi-inside.png',
      alt: 'Hot World Cuisine Buffet interior',
      width: 1600,
      height: 900,
    },
  ];

  const [idx, setIdx] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = (nextIndex: number) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      setIdx(nextIndex);
      return;
    }
    viewport.scrollTo({ left: viewport.clientWidth * nextIndex, behavior: 'smooth' });
    setIdx(nextIndex);
  };

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const nextIndex = Math.round(viewport.scrollLeft / viewport.clientWidth);
    setIdx(nextIndex);
  };

  return (
    <div className="mt-6">
      <div className="mx-auto w-full max-w-3xl">
        <div
          ref={viewportRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-xl jqs-glass shadow"
        >
          {slides.map((slide) => (
            <div key={slide.src} className="w-full shrink-0 snap-center">
              <Image
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                className="w-full h-auto object-contain"
                sizes="(min-width: 1024px) 768px, 100vw"
                priority={slide.src === slides[0].src}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={`hot-world-dot-${slide.src}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                index === idx
                  ? 'bg-neutral-900 dark:bg-neutral-100'
                  : 'bg-neutral-400/40 dark:bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
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
