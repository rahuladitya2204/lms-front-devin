/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Outputs a Single-Page Application (SPA).
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
