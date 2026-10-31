import type { Metadata } from "next";

export const SITE_URL = "https://www.empulse.store";
export const SITE_NAME = "Empulse";

export const SITE_DESCRIPTION =
  "Shop 100% original branded clothing and shoes in Pakistan at Empulse: Lacoste, On, Polo Ralph Lauren, Levi's and more. Cash on delivery, check before you pay, free shipping over Rs. 5,000.";

export const DEFAULT_SHARE_IMAGE = "/og.png?v=4";

// Search snippets show about 155 characters; cut on a word so the description never ends mid-word.
export function snippet(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length).replace(/[,.;:\s]+$/, "")}…`;
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function pageMeta({
  title,
  description,
  path,
  image = DEFAULT_SHARE_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const summary = snippet(description);
  return {
    title,
    description: summary,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: summary,
      url: path,
      siteName: SITE_NAME,
      locale: "en_PK",
      type: "website",
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: [image],
    },
  };
}

export function privateMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    ...pageMeta({ title, description, path }),
    robots: { index: false, follow: false },
  };
}
