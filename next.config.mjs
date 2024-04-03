/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "standalone", // Outputs a Single-Page Application (SPA).
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,
};

export default nextConfig;
