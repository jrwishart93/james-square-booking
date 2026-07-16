import type { Metadata } from 'next';
import UpdatesClient from './UpdatesClient';

export const metadata: Metadata = {
  title: 'Updates & Notices – James Square',
  description:
    'All resident notices, building updates and announcements for James Square, Edinburgh.',
};

export default function UpdatesPage() {
  return <UpdatesClient />;
}
