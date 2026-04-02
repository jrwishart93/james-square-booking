import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
      {
        source: '/useful-info',
        destination: '/local',
        permanent: true,
      },
    ];
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

export default withPWAConfig(nextConfig);
