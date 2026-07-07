import type { MetadataRoute } from 'next';

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
      url: `${BASE_URL}/pool3d`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
