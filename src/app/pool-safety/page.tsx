import type { Metadata } from 'next';

import PoolSafetyClient from './PoolSafetyClient';

const OG_IMAGE = '/images/pool/BC0D4867-E841-4F44-B7B8-90030F8D2E6B.jpeg';

export const metadata: Metadata = {
  title: 'Pool Safety & Operations Centre — James Square',
  description:
    'The digital operations manual for the James Square leisure facilities: live status, interactive floor plan, safety equipment, emergency procedures, pool operation and facility documentation.',
  openGraph: {
    title: 'Pool Safety & Operations Centre — James Square',
    description:
      'The digital operations manual for the James Square leisure facilities: live status, interactive floor plan, safety equipment, emergency procedures, pool operation and facility documentation.',
    images: [
      {
        url: OG_IMAGE,
        width: 848,
        height: 1060,
        alt: 'The James Square residents’ swimming pool',
      },
    ],
  },
};

export default function PoolSafetyPage() {
  return <PoolSafetyClient />;
}
