import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/book/pool',
        destination: '/book/schedule?facility=pool',
        permanent: true,
      },
      {
        source: '/book/gym',
        destination: '/book/schedule?facility=gym',
        permanent: true,
      },
      {
        source: '/book/sauna',
        destination: '/book/schedule?facility=sauna',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
