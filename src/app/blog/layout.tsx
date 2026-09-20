import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Insights on Training, Movement & Recovery | IdeaBin",
  description:
    "Read the IdeaBin blog: practical guides on fitness, running, mobility, nutrition, and training science — curated articles that rotate through our editorial grid.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog — Insights on Training, Movement & Recovery | IdeaBin",
    description:
      "Practical guides on fitness, running, mobility, nutrition, and training science from the IdeaBin editorial team.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IdeaBin — Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Insights on Training, Movement & Recovery | IdeaBin",
    description:
      "Practical guides on fitness, running, mobility, nutrition, and training science from the IdeaBin editorial team.",
    images: ["/og-image.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
