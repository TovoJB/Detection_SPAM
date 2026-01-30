import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://${process.env.API_BACKEND_URL}/:path*`,
      },
    ]
  },
};

export default nextConfig;
