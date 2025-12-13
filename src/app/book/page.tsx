'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Button from '@/components/ui/Button';

const FACILITIES = [
  { name: 'Pool', icon: '/images/icons/pool-icon.png' },
  { name: 'Gym', icon: '/images/icons/gym-icon.png' },
  { name: 'Sauna', icon: '/images/icons/sauna-icon.png' },
];

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-6 font-sans bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center text-center gap-3">
        <h1 className="text-4xl font-bold text-black dark:text-white">Choose a facility</h1>
        <p className="text-base text-gray-600 dark:text-gray-300">Select a space to view schedules and book your spot.</p>
        <div className="w-full max-w-xl flex items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white/70 px-4 py-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-800/60">
          <Button variant="ghost" href="/book/schedule" className="text-sm sm:text-base">
            View availability
          </Button>
          <Button variant="secondary" href="/dashboard" className="text-sm sm:text-base">
            My dashboard
          </Button>
        </div>
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
        {FACILITIES.map(({ name, icon }) => (
          <div
            key={name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center flex-1"
          >
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 relative rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={icon}
                  alt={`${name} icon`}
                  fill
                  className="object-cover filter dark:invert"
                />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              {name}
            </h2>
            <Link href={`/book/schedule?expanded=${name.toLowerCase()}`}>
              <button className="w-full py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-900 transition duration-300">
                Book {name}
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Opening Times and Rules Image */}
      <div className="mt-16 flex flex-col md:flex-row gap-12 text-gray-700 dark:text-gray-300 text-base">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold underline mb-6 text-black dark:text-white">
            Opening Times
          </h2>
          <p className="font-semibold">Facilities open daily from:</p>
          <p className="mb-4">5:30 a.m. to 11:00 p.m.</p>

          <p className="font-semibold">Cleaning hours (Mon–Fri):</p>
          <p className="mb-4">9:30 a.m. – 11:00 a.m.</p>

          <p className="font-semibold">Extended cleaning every other Tuesday:</p>
          <p className="mb-4">9:00 a.m. – 12:30 p.m.</p>

          <p className="font-semibold">No booking required between:</p>
          <p className="mb-4">11:00 a.m. – 5:00 p.m.</p>

          <p className="font-semibold">Booking required from:</p>
          <p>
            5:30 a.m. – 9:30 a.m.
            <br />
            5:00 p.m. – 11:00 p.m.
          </p>
        </div>

        <div className="md:w-1/2 text-center md:text-left">
          {/* Removed the "Rules" title. Only the image is displayed now */}
          <Image
            src="/images/icons/poolrules.png"
            alt="Pool Rules"
            width={500}
            height={700}
            className="mx-auto"
          />
        </div>
      </div>

    </main>
  );
}
