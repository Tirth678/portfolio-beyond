import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: {
    formats: ['image/webp'],
  },
  // Sandboxed previews are served from *.e2b.app; allow their dev resources.
  allowedDevOrigins: ['*.e2b.app'],
};

export default nextConfig;
