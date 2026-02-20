import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use webpack for MediaPipe compatibility
  experimental: {
    webpackBuildWorker: true,
  },
};

export default nextConfig;
