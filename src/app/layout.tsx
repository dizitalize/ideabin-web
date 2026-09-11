import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CenterTransitionProvider } from "@/components/animation/CenterTransition";
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio — Spatial Digital Experience",
  description:
    "A cinematic 3D scroll experience. Scroll-controlled 97-frame sequences, editorial typography, and center-origin spatial page transitions.",
  keywords: [
    "3D scroll website",
    "cinematic web experience",
    "spatial computing",
    "digital experience studio",
    "frame sequence animation",
    "creative technology",
  ],
  openGraph: {
    title: "Studio — Spatial Digital Experience",
    description:
      "A cinematic 3D scroll experience. Scroll-controlled 97-frame sequences, editorial typography, and center-origin spatial page transitions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SmoothScrollProvider>
            <CenterTransitionProvider>
              <Navbar />
              {children}
            </CenterTransitionProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}