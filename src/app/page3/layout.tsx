import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scene Prototype — Internal Experiment | IdeaBin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
