import type { Metadata } from "next";
import "@/app/globals.css";
import { SITE_URL } from "@/lib/config";
import { fontVariables } from "@/lib/fonts";
import BodyShell from "@/components/layout/BodyShell";

const SITE_NAME_EN =
  "Dr. Angel Ancona · Orthopedics, Traumatology & Spine Surgery";

const SITE_DESCRIPTION_EN =
  "Spine surgery in Mérida, Mexico. Guided self-assessment and consultation with Dr. Angel M. Ancona Pérez.";

export const metadata: Metadata = {
  // Necesario para que las URLs relativas (og:image) se resuelvan a absolutas.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME_EN,
    template: "%s | Dr. Ancona Spine Surgery",
  },
  description: SITE_DESCRIPTION_EN,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dr. Angel Ancona · Orthopedics & Spine Surgery",
    url: `${SITE_URL}/en`,
    images: [
      {
        url: "/og-image-en.png",
        width: 1200,
        height: 630,
        alt: "Dr. Angel M. Ancona Pérez — Orthopedics, Traumatology & Spine Surgery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image-en.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        <BodyShell locale="en">{children}</BodyShell>
      </body>
    </html>
  );
}
