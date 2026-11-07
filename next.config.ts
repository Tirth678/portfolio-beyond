import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: {
    formats: ['image/webp'],
  },
};

export default nextConfig;
