import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
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
