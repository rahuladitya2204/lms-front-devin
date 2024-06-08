/** @type {import('next').NextConfig} */

// initialize application utils like interceptors and storage on server side  initInterceptors();
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
  images: {
    domains: ['upload-junk.s3.us-west-2.amazonaws.com'],
  },
  async redirects() {
    return process.env.NODE_ENV === 'production' || true ? [
      {
        source: '/:path*',
        destination: ({ req, params }) => {
          const { host } = req.headers;
          const { path } = params;
          const protocol = req.headers['x-forwarded-proto'] === 'http' ? 'https' : 'http';
          return `${protocol}://${host}/${path}`;
        },
        permanent: true,
      },
    ] : [];
  }
};

export default nextConfig;
