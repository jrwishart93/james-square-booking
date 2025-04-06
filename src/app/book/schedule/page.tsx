import SchedulePageClient from './SchedulePageClient';

export const metadata = {
  title: 'Facility Booking - Schedule',
  description: 'Book your facility time slots',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function SchedulePage() {
  return <SchedulePageClient />;
}
