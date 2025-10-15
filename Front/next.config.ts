import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "im.runware.ai",
        pathname: "/image/ws/**",
      },
    ],
  },
};

export default nextConfig;
