import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from the TrustPatrick API domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pros.trustpatrick.com',
      },
    ],
  },

  // Optional: redirect /find-contractors to the search on homepage
  async redirects() {
    return [
      {
        source: '/find-contractors',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
