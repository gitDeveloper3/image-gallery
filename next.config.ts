import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/', // This is the default route
        destination: '/gallery', // Replace with your desired route
        permanent: true, // Set to true for a 301 redirect, false for a 302
      },
    ];
  },
  /* config options here */
 experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc*', // Allow images that match this pattern
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnail*', // Allow old thumbnail URLs
      },
       {
        protocol: 'https',
        hostname: 'dummyjson.com', // Allow images from dummyjson.com
        pathname: '/image/*', // Adjust the pathname if needed
      },
    ],
  },

};

export default nextConfig;
