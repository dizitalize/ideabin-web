import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import FAQSection from "@/components/sections/FAQSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SiteFooter from "@/components/sections/SiteFooter";
import FluidBackground from "@/components/fluid/FluidBackground";

export default function Home() {
  return (
    <main id="main" className="relative w-full">
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

      {/* 07 Studio Signature Footer */}
      <SiteFooter />
    </main>
  );
}