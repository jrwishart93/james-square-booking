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
      {
        source: '/AGM',
        destination: '/agm',
        permanent: false,
      },
      {
        source: '/Agm',
        destination: '/agm',
        permanent: false,
      },
      {
        source: '/aGM',
        destination: '/agm',
        permanent: false,
      },
      {
        source: '/agM',
        destination: '/agm',
        permanent: false,
      },
      {
        source: '/AGm',
        destination: '/agm',
        permanent: false,
      },
      {
        source: '/aGm',
        destination: '/agm',
        permanent: false,
      },
      {
        source: '/AgM',
        destination: '/agm',
        permanent: false,
      },
    ];
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

export default withPWAConfig(nextConfig);
