import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // `/?road=x` used to open the Bay Area map, which now lives at /bay-area.
        source: "/",
        has: [{ type: "query", key: "road", value: "(?<road>.*)" }],
        destination: "/bay-area?road=:road",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
