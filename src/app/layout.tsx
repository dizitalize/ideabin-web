import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Kalam, Plus_Jakarta_Sans, Sora, Comfortaa } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CenterTransitionProvider } from "@/components/animation/CenterTransition";
import Navbar from "@/components/ui/Navbar";
import JsonLd from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
     images: [
       {
         url: "/og-image.png",
         width: 1200,
         height: 630,
         alt: "IdeaBin - Spatial Digital Experience Studio"
       }
     ]
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
         className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${kalam.variable} ${plusJakartaSans.variable} ${sora.variable} ${comfortaa.variable} antialiased`}
       >
         <ThemeProvider>
           <SmoothScrollProvider>
             <CenterTransitionProvider>
               <Navbar />
               {children}
             </CenterTransitionProvider>
           </SmoothScrollProvider>
           <JsonLd />
         </ThemeProvider>
       </body>
     </html>
   );
 }