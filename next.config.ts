import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow larger pasted text / file uploads through Server Actions.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
