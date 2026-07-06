import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
<<<<<<< HEAD
=======
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
>>>>>>> develop
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
<<<<<<< HEAD
=======
        pathname: '/**',
>>>>>>> develop
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
<<<<<<< HEAD
=======
        pathname: '/**',
>>>>>>> develop
      },
    ],
  },
};

export default nextConfig;
