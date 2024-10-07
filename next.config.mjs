import { withSentryConfig } from '@sentry/nextjs';
import CompressionPlugin from 'compression-webpack-plugin';
import withPWA from 'next-pwa'; // Import next-pwa

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,
  images: {
    domains: ['upload-junk.s3.us-west-2.amazonaws.com'],
  },
  async redirects() {
    return [
      // Uncomment and modify as needed
      // {
      //   source: '/',
      //   destination: '/home',
      //   permanent: true,
      // },
    ];
  },
  experimental: {
    granularChunks: true,
  },
  swcMinify: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.fallback = { fs: false };

    if (!isServer) {
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );

      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

export default withSentryConfig(
  withPWA({
    dest: 'public', // Ensure 'dest' is placed directly in the PWA configuration
    disable: process.env.NODE_ENV === 'development',
    buildExcludes: [/middleware-manifest.json$/], // Avoid conflicts with Next.js edge runtime
  })(nextConfig),
  {
    org: 'testmintai',
    project: 'javascript-nextjs',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
