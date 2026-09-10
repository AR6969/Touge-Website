import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Bay Area map moved back to the homepage.
      { source: "/bay-area", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
