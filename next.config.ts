import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/articulos.html",
        destination: "/padecimientos",
        permanent: true, // redirección permanente (308) para preservar SEO
      },
    ];
  },
};

export default nextConfig;
