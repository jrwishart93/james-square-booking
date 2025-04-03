'use client';

import React from 'react';
import Link from 'next/link';

const FACILITIES = [
  { name: 'Pool', emoji: '🏊‍♂️' },
  { name: 'Gym', emoji: '🏋️‍♀️' },
  { name: 'Sauna', emoji: '🧖‍♀️' },
];

const RULES = [
  { title: 'Respect shared spaces', text: 'Please leave all areas clean and tidy for the next resident.' },
  { title: 'Be considerate of other users', text: 'Use the booking system during peak times. Facilities are open to all, without booking, from 11:00 a.m. – 5:00 p.m.' },
  { title: 'Children in the pool', text: 'Children must be supervised by an adult at all times in the pool area.' },
  { title: 'No food, alcohol or glass', text: 'Only bottled water is permitted. No alcohol or glass containers allowed.' },
  { title: 'Shower before using the pool or sauna', text: 'Help keep the water clean by rinsing off before entering.' },
  { title: 'Cancel if you can’t attend', text: 'Cancel bookings you won’t use so others can take your place.' },
  { title: 'Maximum group size: 6 people', text: 'No more than 6 people may use a facility at once.' },
  { title: 'Be out by 11:00 p.m.', text: 'An alarm will sound if anyone remains after hours.' },
  { title: 'Damage and rule breaches', text: 'Residents may be liable for damage or breaches of these rules.' },
];

export default function BookPage() {
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
        {FACILITIES.map(({ name, emoji }) => (
          <div key={name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center flex-1">
            <h2 className="text-2xl font-semibold mb-4">{emoji} {name}</h2>
            <Link href="/book/schedule">
              <button className="w-full py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-900 transition">
                Book
              </button>
            </Link>
          </div>
        ))}
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
          <ul className="list-none space-y-3 text-sm">
            {RULES.map(({ title, text }) => (
              <li key={title}>
                <strong>{title}</strong><br />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}