'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="py-20 px-4">
      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">James Square Booking Portal</h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto mb-10">
          Welcome to the official booking portal for residents and guests of James Square.
          Use the tabs above to book access to our pool, gym, and sauna — or browse local suggestions.
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
