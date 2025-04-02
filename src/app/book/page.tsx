'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center">Book Facilities</h1>

      <div className="text-center mb-8">
        <Link href="/book/schedule">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            View Availability
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center flex-1">
          <h2 className="text-2xl font-semibold mb-4">🏊‍♂️ Pool</h2>
          <Link href="/book/pool">
            <button className="w-full py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-900 transition">
              Book Pool
            </button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center flex-1">
          <h2 className="text-2xl font-semibold mb-4">🏋️‍♀️ Gym</h2>
          <Link href="/book/gym">
            <button className="w-full py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-900 transition">
              Book Gym
            </button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center flex-1">
          <h2 className="text-2xl font-semibold mb-4">🧖‍♀️ Sauna</h2>
          <Link href="/book/sauna">
            <button className="w-full py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-900 transition">
              Book Sauna
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-16 flex flex-col md:flex-row gap-12 text-gray-700 dark:text-gray-300 text-base">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold underline mb-6">Opening Times</h2>

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
            5:30 a.m. – 9:30 a.m.<br />
            5:00 p.m. – 11:00 p.m.
          </p>
        </div>

        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold underline mb-6 text-red-600">Rules</h2>
          <ul className="list-none space-y-3 text-sm text-gray-800 dark:text-gray-300">
            <li>
              <strong>Respect shared spaces</strong><br />
              Please leave all areas clean and tidy for the next resident.
            </li>
            <li>
              <strong>Be considerate of other users</strong><br />
              Use the booking system during peak times.<br />
              Facilities are open to all, without booking, from 11:00 a.m. – 5:00 p.m.
            </li>
            <li>
              <strong>Children in the pool</strong><br />
              Children must be supervised by an adult at all times in the pool area.
            </li>
            <li>
              <strong>No food, alcohol or glass</strong><br />
              Only bottled water is permitted. No alcohol or glass containers allowed.
            </li>
            <li>
              <strong>Shower before using the pool or sauna</strong><br />
              Help keep the water clean by rinsing off before entering.
            </li>
            <li>
              <strong>Cancel if you can’t attend</strong><br />
              Cancel bookings you won’t use so others can take your place.
            </li>
            <li>
              <strong>Maximum group size: 6 people</strong><br />
              No more than 6 people may use a facility at once.
            </li>
            <li>
              <strong>Be out by 11:00 p.m.</strong><br />
              An alarm will sound if anyone remains after hours.
            </li>
            <li>
              <strong>Damage and rule breaches</strong><br />
              Residents may be liable for damage or breaches of these rules.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}