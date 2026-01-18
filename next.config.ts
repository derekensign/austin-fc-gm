import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.mlssoccer.com',
        pathname: '/**',
      },
    ],
  },
  // Externalize puppeteer for serverless (Vercel) - it's only used in API routes
  serverExternalPackages: ['puppeteer', 'puppeteer-core'],
  // Webpack config to handle puppeteer
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle puppeteer on server
      config.externals = config.externals || [];
      config.externals.push('puppeteer', 'puppeteer-core');
    }
    return config;
  },
};

export default nextConfig;
