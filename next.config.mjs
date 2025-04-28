import CompressionPlugin from 'compression-webpack-plugin';
import BrotliPlugin from 'brotli-webpack-plugin';
import withPWA from 'next-pwa';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_CDN_URL : '',
  // Optimize for better development experience
  reactStrictMode: false, // Disable strict mode for better hot reload
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload-junk.s3.us-west-2.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'assets.testmint.ai',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'nimblebee-front-cdn.azureedge.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'testmintai-back.azurewebsites.net',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'www.nimblebee.local',
        pathname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === 'development', // Disable optimization in dev for faster builds
  },
  experimental: {
    // Only keep valid experimental options
    optimizeCss: true,
    optimizePackageImports: ['antd', '@emotion/styled', 'lodash', '@adewaskar/lms-common'],
  },
  swcMinify: true,
  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false };

    // Improve compilation speed in development
    if (dev) {
      // Use eval-source-map for faster rebuilds in development
      config.devtool = 'eval-source-map';
      
      // Reduce the number of modules being processed
      config.watchOptions = {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
      };
      
      // Enable caching for faster rebuilds
      config.cache = true;
    }

    if (!isServer && !dev) {
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8,
        }),
        new BrotliPlugin({
          asset: '[path].br[query]',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 60000, // Further reduced for better performance
        maxAsyncRequests: 30,
        maxInitialRequests: 25,
        cacheGroups: {
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            chunks: 'all',
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            priority: 30,
            chunks: 'all',
            name(module) {
              if (!module.context) return 'npm.unknown';
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1] : 'unknown';
              return `npm.${packageName.replace('@', '')}`;
            },
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
          shared: {
            name: 'shared',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          }
        }
      };
      
      // Optimize module ids for smaller bundles
      config.optimization.moduleIds = 'deterministic';
    }
    return config;
  },
};

// Simplify the export for testing
export default withBundleAnalyzer(nextConfig);
