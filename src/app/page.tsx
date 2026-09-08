import Hero from "@/components/sections/Hero";
import CapabilitiesSection from "@/components/sections/CapabilitiesSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import SiteFooter from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <main id="main">
      {/* Unified 3D Cinematic Scroll Experience (Page 1 -> Transition -> Page 2) */}
      <Hero />

      {/* Scene 03 – Capabilities Transformation */}
      <CapabilitiesSection />

      {/* Scene 04 & 05 – Philosophy + Spatial Transition Launchpad */}
      <PhilosophySection />

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}