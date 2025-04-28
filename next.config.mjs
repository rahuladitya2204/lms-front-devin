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
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,
  images: {
    domains: ['upload-junk.s3.us-west-2.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Enable fast refresh explicitly
    fastRefresh: true,
    granularChunks: true,
    concurrentFeatures: true, 
    serverActions: true,
    optimizeCss: true,
    optimizePackageImports: ['antd', '@emotion/styled', 'lodash'],
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
        }),
        new BrotliPlugin({
          asset: '[path].br[query]',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );

      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            chunks: 'all',
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            priority: 30,
            chunks: 'all',
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: 'shared',
            minChunks: 2,
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(
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
);
