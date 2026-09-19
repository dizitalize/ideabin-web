import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Marquee — Internal Experiment | IdeaBin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MarqueeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
