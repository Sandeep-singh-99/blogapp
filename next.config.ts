import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  

  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };
  //   return config;
  // },
};

export default nextConfig;
