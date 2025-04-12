'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FACILITIES = [
  { name: 'Pool', icon: '/images/icons/pool-icon.png' },
  { name: 'Gym', icon: '/images/icons/gym-icon.png' },
  { name: 'Sauna', icon: '/images/icons/sauna-icon.png' },
];

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6 font-sans bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-white">
        Book Facilities
      </h1>

      {/* Buttons Container: View Availability and My Dashboard */}
      <div className="text-center mb-8 flex justify-center gap-4">
        <Link href="/book/schedule">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            View Availability
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            My Dashboard
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6">
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

      {/* Lower Navigation Button */}
      <div className="flex justify-center mt-6">
        <Link href="/dashboard">
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
            My Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}