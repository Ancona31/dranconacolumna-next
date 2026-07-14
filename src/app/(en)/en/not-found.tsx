import type { Metadata } from "next";
import NotFoundView from "@/components/layout/NotFoundView";
import { getUiStrings } from "@/lib/i18n";

const strings = getUiStrings("en");

export const metadata: Metadata = { title: strings.notFound.metaTitle };

export default function NotFound() {
  return <NotFoundView strings={strings} />;
}
