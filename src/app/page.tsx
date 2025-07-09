'use client';

import Image from 'next/image';
import Link from 'next/link';
import MessageBoardHighlights from '@/components/MessageBoard/MessageBoardHighlights';

export default function Home() {
  return (
    <main className="py-20 px-4">
      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 font-sans text-neutral-900 dark:text-white">
            James Square Booking Portal
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-sans">
            This website has been created to help residents of James Square easily book time slots for the pool, gym, and sauna facilities. Residents can sign up and reserve up to two sessions per facility per day, with bookings available in the mornings and evenings.
          </p>

          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 mt-4 font-sans">
            To ensure fair use for everyone, please note that you may not book the same time slot more than three consecutive days in a row. This helps prevent individuals from monopolising popular times.
          </p>

          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 mt-4 font-sans">
            Between 11:00 a.m. and 5:00 p.m., the facilities are open for free use without bookings. If you&apos;re hosting short-term guests within James Square, please encourage guests to use the facilities during these times to free up the booking slots for residents who actually live here.
          </p>

          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 mt-4 font-sans">
            Please only book slots you plan to use. If a pattern of repeated no-shows is detected, booking restrictions may be applied to your account.
          </p>

          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 mt-4 font-sans">
            This booking system exists to support all residents so let&apos;s keep it fair, respectful, and enjoyable for everyone at James Square.
          </p>

          <hr className="my-6 border-neutral-300 dark:border-neutral-700" />

          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-sans">
            To book a time slot, simply head to the{' '}
            <Link href="/book" className="underline text-blue-600 dark:text-blue-400">
              Book Facilities
            </Link>{' '}
            page. You&apos;ll need to be signed up and logged in. Once you&apos;ve made a booking, it will appear on your{' '}
            <Link href="/book/my-bookings" className="underline text-blue-600 dark:text-blue-400">
              My Bookings
            </Link>{' '}
            page, where you can keep track of your reservations and easily add them to your Apple Calendar or Google Calendar.
          </p>
        </div>
      </div>

      {/* Responsive Image Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <aside className="bg-white dark:bg-neutral-900 rounded-lg shadow p-4 space-y-2">
          <h2 className="text-xl font-semibold">Message Board</h2>
          <MessageBoardHighlights limit={3} />
          <div className="text-right">
            <Link href="/message-board" className="underline text-sm">
              View all posts→
            </Link>
          </div>
        </aside>
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