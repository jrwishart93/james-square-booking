'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const recommendations = [
  {
    name: 'La Casa',
    image: '/images/venues/la-casa.jpg',
    description: 'Rustic Spanish tapas and wine bar near Haymarket.',
    address: '10 Eyre Place, Edinburgh EH3 5EP',
    link: 'https://www.lacasauk.com/',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.167763481791!2d-3.2167641!3d55.945402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c7bca2a1a8c3%3A0x2d82435e93821d7c!2sLa%20Casa!5e0!3m2!1sen!2suk!4v1615300000000!5m2!1sen!2suk'
  },
  {
    name: 'First Coast',
    image: '/images/venues/first-coast.jpg',
    description: 'Modern Scottish bistro serving seasonal dishes.',
    address: '97-101 Dalry Road, Edinburgh EH11 2AB',
    link: 'https://www.first-coast.co.uk/',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.1421627523023!2d-3.2191236!3d55.9457634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c7b6b38c9abf%3A0xe4f6b939a650f496!2sFirst%20Coast!5e0!3m2!1sen!2suk!4v1615300000001!5m2!1sen!2suk'
  },
  {
    name: 'Locanda de Gusti',
    image: '/images/venues/locanda.jpg',
    description: 'Authentic Neapolitan cuisine from southern Italy.',
    address: '102 Dalry Road, Edinburgh EH11 2DW',
    link: 'https://www.locandadegusti.com/',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.108679375208!2d-3.2187312!3d55.946254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c7b61b1dc8f3%3A0x2787f41e1b71929f!2sLocanda%20De%20Gusti!5e0!3m2!1sen!2suk!4v1615300000002!5m2!1sen!2suk'
  },
  {
    name: 'Sushiya',
    image: '/images/venues/sushiya.jpg',
    description: 'Small, hidden sushi bar with incredible fresh rolls.',
    address: '19 Dalry Road, Edinburgh EH11 2BQ',
    link: 'https://www.instagram.com/sushiya.edinburgh/',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.1448827277795!2d-3.2137752!3d55.9457261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c7b5e7395c7b%3A0x77e693938ddbe9de!2sSushiya!5e0!3m2!1sen!2suk!4v1615300000003!5m2!1sen!2suk'
  }
];

export default function LocalPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Local Food & Drink Suggestions</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
        A few personal favourites just minutes from James Square.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {recommendations.map((place) => {
          const isOpen = expanded === place.name;
          return (
            <motion.div
              key={place.name}
              layout
              transition={{ layout: { duration: 0.4, type: 'spring' } }}
              className={`bg-white dark:bg-gray-900 rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer ${isOpen ? 'col-span-2' : ''}`}
              onClick={() => setExpanded(isOpen ? null : place.name)}
            >
              <motion.div
                layout
                className="relative w-full rounded overflow-hidden mb-3"
                style={{ height: isOpen ? 'auto' : '200px' }}
              >
                <Image
                  src={place.image}
                  alt={place.name}
                  layout="responsive"
                  width={800}
                  height={isOpen ? 600 : 300}
                  objectFit="cover"
                  className="rounded"
                />
              </motion.div>
              <motion.h2 layout className="text-xl font-semibold mb-1">{place.name}</motion.h2>
              <motion.p layout className="text-sm text-gray-600 dark:text-gray-400 mb-2">{place.description}</motion.p>
              <motion.a
                layout
                href={place.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Visit website
              </motion.a>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Address:</strong> {place.address}
                    </p>
                    <iframe
                      src={place.mapEmbed}
                      width="100%"
                      height="200"
                      allowFullScreen
                      loading="lazy"
                      className="rounded border mt-2"
                    ></iframe>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
