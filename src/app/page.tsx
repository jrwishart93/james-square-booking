'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="py-20 px-4">
      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">James Square Booking Portal</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-10">
          This website has been created to help residents of James Square easily book time slots for the pool, gym, and sauna facilities. Residents can sign up and reserve up to two sessions per facility per day, with bookings available in the mornings and evenings.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-6">
          To ensure fair use for everyone, please note that you may not book the same time slot more than three consecutive days in a row. This helps prevent individuals from monopolising popular times.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-6">
          Between 11:00 a.m. and 5:00 p.m., the facilities are open for free use without bookings. If you’re hosting short-term guests within James Square, please encourage guests use the facilities during these times to free up the booking slots for residents who actually live here.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-6">
          Please only book slots you plan to use. If a pattern of repeated no-shows is detected, booking restrictions may be applied to your account.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-10">
          This booking system exists to support all residents so let’s keep it fair, respectful, and enjoyable for everyone at James Square.
        </p>
      </div>

      {/* Responsive Image Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Front Image */}
        <div className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/buildingimages/front.jpg"
            alt="James Square from the front"
            width={800}
            height={600}
            objectFit="cover"
          />
        </div>

        {/* Above Image */}
        <div className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/buildingimages/above.jpg"
            alt="James Square from above"
            width={800}
            height={600}
            objectFit="cover"
          />
        </div>

        {/* Garden Image */}
        <div className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/buildingimages/garden.jpg"
            alt="James Square Garden"
            width={800}
            height={600}
            objectFit="cover"
          />
        </div>

        {/* Pool Image wrapped in a Link */}
        <Link href="/book/schedule">
          <div className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer">
            <Image
              src="/images/buildingimages/pool.jpg"
              alt="James Square Pool"
              width={800}
              height={600}
              objectFit="cover"
            />
          </div>
        </Link>
      </div>
    </main>
  );
}
