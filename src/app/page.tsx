import type { Metadata } from "next";
import HomeArrival from "@/components/HomeArrival";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import FAQSection from "@/components/sections/FAQSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogSection from "@/components/sections/BlogSection";
import SiteFooter from "@/components/sections/SiteFooter";
import FluidBackground from "@/components/fluid/FluidBackground";
import { FaqJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main id="main" className="relative w-full">
      <HomeArrival />
      <FaqJsonLd />

      {/* Interactive WebGL Fluid simulation active continuously from the 3rd page through all sections */}
      <FluidBackground />

      {/* Unified 3D Cinematic Scroll Experience (01 Spatial -> 02 Philosophy -> 03 Cinematic 3D Gallery) */}
      <Hero />

      {/* 04 Capabilities & Services Stacking Cards */}
      <ServicesSection />

      {/* 05 Frequently Asked Questions */}
      <FAQSection />

      {/* 06 Studio Moodboard — Client Testimonials */}
      <TestimonialsSection />

      {/* 07 Reference Blog Bento Grid */}
      <BlogSection />

      {/* 08 Studio Signature Footer */}
      <SiteFooter />
    </main>
  );
}