'use client';

import React, { useState } from 'react';

const timeSlots = [
  '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30'
];

const generateInitialBookings = () => {
  const facilities = ['Pool', 'Gym', 'Sauna'];
  const bookings: Record<string, string[]> = {};
  facilities.forEach((facility) => (bookings[facility] = []));
  return bookings;
};

const formatSlot = (start: string, end: string, status: string, facility: string, isBooked: boolean, onBook: () => void) => {
  let textColor = 'text-gray-800 dark:text-gray-200';
  let bgColor = 'bg-green-100';

  if (status === 'Unavailable') {
    textColor = 'text-gray-400';
    bgColor = 'bg-red-100';
  } else if (status === 'Cleaning') {
    textColor = 'text-blue-700';
    bgColor = 'bg-blue-100';
  } else if (isBooked) {
    textColor = 'text-gray-500';
    bgColor = 'bg-red-200';
  }

  return (
    <li key={start} className={`flex justify-between items-center px-3 py-2 rounded ${textColor} ${bgColor}`}>
      <span className="text-sm font-medium">{`${start} – ${end}`}</span>
      {status === 'Available' && !isBooked ? (
        <button onClick={onBook} className="text-xs text-white bg-black rounded px-2 py-1 hover:bg-gray-900 transition">Book</button>
      ) : (
        <span className="text-xs italic">{isBooked ? 'Booked' : status}</span>
      )}
    </li>
  );
};

const renderSchedule = (facility: string, isExpanded: boolean, bookings: Record<string, string[]>, setBookings: React.Dispatch<React.SetStateAction<Record<string, string[]>>>) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700">
    <h2 className="text-xl font-bold mb-3 text-center md:text-left">{facility}</h2>
    <ul className="space-y-2 overflow-hidden transition-all ease-in-out duration-300">
      {timeSlots.map((start, i) => {
        const end = timeSlots[i + 1];
        if (!end) return null;

        const [hour, minute] = start.split(':');
        const h = parseInt(hour, 10);
        const m = parseInt(minute, 10);
        const timeValue = h * 60 + m;

        let status = 'Available';

        if ((h === 9 && m >= 30) || h === 10) {
          status = 'Cleaning';
        } else if ((timeValue >= 570 && timeValue < 690) || (timeValue >= 1020 && timeValue < 1380)) {
          status = 'Unavailable';
        }

        const isBooked = bookings[facility].includes(start);
        const isPreview = i < 4;

        const onBook = () => {
          setBookings((prev) => ({
            ...prev,
            [facility]: [...prev[facility], start]
          }));
        };

        return isExpanded || isPreview ? formatSlot(start, end, status, facility, isBooked, onBook) : null;
      })}
    </ul>
  </div>
);

export default function Page() {
  const [expanded, setExpanded] = useState(false);
  const [bookings, setBookings] = useState<Record<string, string[]>>(generateInitialBookings);

  return (
    <main className="max-w-6xl mx-auto py-16 px-4 font-sans bg-[#fefefe] dark:bg-black">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-black dark:text-white">Facility Booking Schedule</h1>

      <p className="text-center text-gray-700 dark:text-gray-300 mb-8 text-base md:text-lg">
        View and manage available time slots for the pool, gym, and sauna.<br />
        Booking required during:<br />
        <span className="font-semibold">5:30 a.m. – 9:30 a.m. & 5:00 p.m. – 11:00 p.m.</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderSchedule('Pool', expanded, bookings, setBookings)}
        {renderSchedule('Gym', expanded, bookings, setBookings)}
        {renderSchedule('Sauna', expanded, bookings, setBookings)}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 underline hover:text-blue-800 text-sm"
        >
          {expanded ? 'Collapse Schedule' : 'Expand Full Day'}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-10">
        Select a time slot to start booking.
      </p>
    </main>
  );
}