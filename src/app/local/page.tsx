"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SectionTabs from "./components/SectionTabs";

const restaurantRecommendations = [
  {
    name: "La Casa",
    image: "/images/venues/la-casa.jpg",
    description: "Rustic Spanish tapas and wine bar near Haymarket.",
    address: "10 Eyre Place, Edinburgh EH3 5EP",
    link: "https://www.lacasauk.com/",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.167763481791!2d-3.2167641!3d55.945402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c7bca2a1a8c3%3A0x2d82435e93821d7c!2sLa%20Casa!5e0!3m2!1sen!2suk!4v1615300000000!5m2!1sen!2suk",
  },
  {
    name: "First Coast",
    image: "/images/venues/first-coast.jpg",
    description: "Modern Scottish bistro serving seasonal dishes.",
    address: "97-101 Dalry Road, Edinburgh EH11 2AB",
    link: "https://www.first-coast.co.uk/",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.1421627523023!2d-3.2191236!3d55.9457634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c7b6b38c9abf%3A0xe4f6b939a650f496!2sFirst%20Coast!5e0!3m2!1sen!2suk!4v1615300000001!5m2!1sen!2suk",
  },
  {
    name: "Locanda de Gusti",
    image: "/images/venues/locanda.jpg",
    description: "Authentic Neapolitan cuisine from southern Italy.",
    address: "102 Dalry Road, Edinburgh EH11 2DW",
    link: "https://www.locandadegusti.com/",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.108679375208!2d-3.2187312!3d55.946254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c7b61b1dc8f3%3A0x2787f41e1b71929f!2sLocanda%20De%20Gusti!5e0!3m2!1sen!2suk!4v1615300000002!5m2!1sen!2suk",
  },
  {
    name: "Sushiya",
    image: "/images/venues/sushiya.jpg",
    description: "Small, hidden sushi bar with incredible fresh rolls.",
    address: "19 Dalry Road, Edinburgh EH11 2BQ",
    link: "https://www.instagram.com/sushiya.edinburgh/",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.1448827277795!2d-3.2137752!3d55.9457261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c7b5e7395c7b%3A0x77e693938ddbe9de!2sSushiya!5e0!3m2!1sen!2suk!4v1615300000003!5m2!1sen!2suk",
  },
];

const groceryHighlights = [
  {
    name: "Margiotta",
    description: "Independent grocer with ready meals, produce, and fresh pastries.",
    address: "53-59 Dalry Road, Edinburgh EH11 2BS",
    hours: "Daily 7:30am – 10pm",
  },
  {
    name: "Lidl Haymarket",
    description: "Affordable supermarket for essentials just a short walk away.",
    address: "11 Dalry Road, Edinburgh EH11 2AQ",
    hours: "Daily 8am – 10pm",
  },
];

const coffeeStops = [
  {
    name: "Café Lucano",
    description: "Italian-style coffee with homemade pastries and relaxed seating.",
    address: "37-39 Shandwick Place, Edinburgh EH2 4RG",
  },
  {
    name: "Thomas J. Walls",
    description: "Speciality beans, brunch plates, and a light-filled space for meetings.",
    address: "45 Forrest Road, Edinburgh EH1 2QH",
  },
  {
    name: "Lowdown",
    description: "Minimalist café serving carefully sourced espresso and filter options.",
    address: "40 George Street, Edinburgh EH2 2LE",
  },
];

export default function LocalPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Local Favourites Around James Square</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Navigate the highlights near the development—factor services, AGM details, community projects,
          and the best nearby places for food, groceries, and coffee breaks.
        </p>
      </header>

      <SectionTabs />

      <div className="space-y-16 pt-8">
        <section id="factor" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-semibold">Factor</h2>
          <p className="text-gray-700 dark:text-gray-200">
            Fior Asset &amp; Property oversee factor services for James Square. Residents can find the latest
            documentation, service contacts, and payment information on the dedicated factor page.
          </p>
          <Link href="/factor" className="text-sm font-semibold text-blue-600 hover:underline">
            View full factor details
          </Link>
        </section>

        <section id="agm" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-semibold">AGM</h2>
          <p className="text-gray-700 dark:text-gray-200">
            Stay informed about annual general meetings, including proposed agenda items and minutes from
            previous gatherings. Keep an eye out for RSVP requests and pre-meeting surveys so that your
            feedback can shape the discussion.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>Next AGM date and venue announcements</li>
            <li>Downloadable meeting packs and slides</li>
            <li>Summary of action items and follow-up owners</li>
          </ul>
        </section>

        <section id="projects" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <p className="text-gray-700 dark:text-gray-200">
            Community-led improvements are ongoing throughout James Square, from shared garden upgrades to
            energy-efficiency retrofits. Browse current initiatives and learn how to get involved.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-lg border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <h3 className="font-semibold">Courtyard Greening</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Volunteers are adding planters, lighting, and seasonal planting to enhance communal spaces.
              </p>
            </article>
            <article className="rounded-lg border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <h3 className="font-semibold">EV Charging Pilot</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Residents can register interest in the rollout of shared EV charge points in the parking area.
              </p>
            </article>
          </div>
        </section>

        <section id="bins" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-semibold">Bins &amp; Recycling</h2>
          <p className="text-gray-700 dark:text-gray-200">
            Edinburgh Council collection days are staggered by building. Make sure bins are out by 7am and
            stored neatly after collection to keep paths clear.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm dark:border-white/20">
              <h3 className="font-semibold">General Waste</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Collected every Monday morning.</p>
            </div>
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm dark:border-white/20">
              <h3 className="font-semibold">Mixed Recycling</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Alternate Wednesdays (odd weeks).</p>
            </div>
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm dark:border-white/20">
              <h3 className="font-semibold">Glass</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Community glass bins beside Block C.</p>
            </div>
          </div>
        </section>

        <section id="restaurants" className="scroll-mt-24">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Restaurants</h2>
            <p className="text-gray-700 dark:text-gray-200">
              A handful of go-to dinner spots within walking distance of James Square. Tap a card to reveal
              maps, addresses, and booking links.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {restaurantRecommendations.map((place) => {
              const isOpen = expanded === place.name;

              return (
                <motion.div
                  key={place.name}
                  layout
                  transition={{ layout: { duration: 0.4, type: "spring" } }}
                  className={`cursor-pointer rounded-lg bg-white shadow transition hover:shadow-md dark:bg-gray-900 ${
                    isOpen ? "sm:col-span-2" : ""
                  }`}
                  onClick={() => setExpanded(isOpen ? null : place.name)}
                >
                  <motion.div
                    layout
                    className="relative w-full overflow-hidden rounded-t"
                    style={{ height: isOpen ? "auto" : "200px" }}
                  >
                    <Image
                      src={place.image}
                      alt={place.name}
                      layout="responsive"
                      width={800}
                      height={isOpen ? 600 : 300}
                      objectFit="cover"
                      className="rounded-t"
                    />
                  </motion.div>
                  <div className="p-4">
                    <motion.h3 layout className="text-xl font-semibold">
                      {place.name}
                    </motion.h3>
                    <motion.p layout className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                      {place.description}
                    </motion.p>
                    <motion.a
                      layout
                      href={place.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit website
                    </motion.a>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 space-y-2"
                        >
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Address:</strong> {place.address}
                          </p>
                          <iframe
                            src={place.mapEmbed}
                            width="100%"
                            height="200"
                            allowFullScreen
                            loading="lazy"
                            className="mt-2 rounded border"
                          ></iframe>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="groceries" className="scroll-mt-24 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Groceries</h2>
            <p className="text-gray-700 dark:text-gray-200">
              Pick up everyday essentials or speciality ingredients from these reliable local shops.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {groceryHighlights.map((shop) => (
              <div
                key={shop.name}
                className="rounded-lg border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-lg font-semibold">{shop.name}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{shop.description}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {shop.address}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{shop.hours}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="coffee" className="scroll-mt-24 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Coffee</h2>
            <p className="text-gray-700 dark:text-gray-200">
              Refuel between meetings or enjoy a weekend catch-up at these coffee spots.
            </p>
          </div>
          <ul className="space-y-4">
            {coffeeStops.map((spot) => (
              <li key={spot.name} className="rounded-lg border border-gray-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                <h3 className="text-lg font-semibold">{spot.name}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{spot.description}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {spot.address}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
