import { withSentryConfig } from '@sentry/nextjs';
import CompressionPlugin from 'compression-webpack-plugin';
import withPWA from 'next-pwa';
import { createRequire } from 'module'; // Import `createRequire` to support CommonJS imports

const require = createRequire(import.meta.url); // Use `createRequire` to load CommonJS modules
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
    return [];
  },
  experimental: {
    granularChunks: true,
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
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
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(
  withSentryConfig(
    withPWA({
      dest: 'public',
      disable: process.env.NODE_ENV === 'development',
      buildExcludes: [/middleware-manifest.json$/],
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
  )
);
