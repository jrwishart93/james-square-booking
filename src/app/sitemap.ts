import type { MetadataRoute } from 'next';

import { PUBLIC_LISTING as GYM_AREA_PUBLIC } from './gym-area/visibility';

const BASE_URL = 'https://james-square.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/pool-safety`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cleaning`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cctv`,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/local`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/stories`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/pool3d`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...(GYM_AREA_PUBLIC
      ? [{ url: `${BASE_URL}/gym-area`, changeFrequency: 'monthly' as const, priority: 0.6 }]
      : []),
  ];
}
