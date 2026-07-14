import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Con múltiples root layouts (route groups (es)/(en)) no hay un layout único
  // desde el que componer el 404 global de rutas no coincidentes. globalNotFound
  // permite definir app/global-not-found.tsx para ese caso.
  experimental: {
    globalNotFound: true,
  },
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
