import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Testimonials & Reviews | IdeaBin",
  description:
    "Read what founders and teams say about working with IdeaBin on 3D web experiences, e-commerce platforms, custom software, and cloud infrastructure projects.",
  alternates: {
    canonical: "/testimonials",
  },
  openGraph: {
    type: "website",
    url: "/testimonials",
    title: "Client Testimonials & Reviews | IdeaBin",
    description:
      "Read what founders and teams say about working with IdeaBin on 3D web experiences, e-commerce platforms, custom software, and cloud infrastructure projects.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IdeaBin — Client Testimonials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Testimonials & Reviews | IdeaBin",
    description:
      "Read what founders and teams say about working with IdeaBin on 3D web experiences, e-commerce platforms, custom software, and cloud infrastructure projects.",
    images: ["/og-image.png"],
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
