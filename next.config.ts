import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Con múltiples root layouts (route groups (es)/(en)) no hay un layout único
  // desde el que componer el 404 global de rutas no coincidentes. globalNotFound
  // permite definir app/global-not-found.tsx para ese caso.
  experimental: {
    globalNotFound: true,
  },
  // Recursos pesados del esqueleto 3D y del hero (.glb, decodificador Draco,
  // pósters y diapositivas): caché de un año sin revalidar, para que al volver
  // atrás no se descarguen ni decodifiquen de nuevo. Se sirven desde /public
  // (Next no les pone hash): si uno cambia, debe cambiar también su NOMBRE
  // (p. ej. skeleton-high.v2.glb) o los visitantes seguirán con el viejo.
  async headers() {
    const immutable = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];
    return [
      { source: "/models/:path*", headers: immutable },
      { source: "/draco/:path*", headers: immutable },
      { source: "/img/skeleton/:path*", headers: immutable },
    ];
  },
  async redirects() {
    return [
      {
        source: "/articulos.html",
        destination: "/padecimientos",
        permanent: true, // redirección permanente (308) para preservar SEO
      },
      // F4.c: túnel del carpo se reestructuró como página general de muñeca y
      // mano. El slug viejo redirige 308 al nuevo (ES y EN) para conservar SEO.
      {
        source: "/padecimientos/tunel-del-carpo",
        destination: "/padecimientos/dolor-de-muneca-y-mano",
        permanent: true,
      },
      {
        source: "/en/conditions/carpal-tunnel",
        destination: "/en/conditions/wrist-and-hand-pain",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
