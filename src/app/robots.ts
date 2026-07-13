import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/** Robots nativo de Next. Todo el sitio es público e indexable. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
