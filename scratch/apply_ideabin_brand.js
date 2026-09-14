const fs = require("fs");
const path = require("path");

// 1. Update Navbar.tsx
const navbarPath = path.join(__dirname, "../src/components/ui/Navbar.tsx");
let navbarContent = fs.readFileSync(navbarPath, "utf8");

// Add import if not present
if (!navbarContent.includes("IdeaBinBrand")) {
  navbarContent = navbarContent.replace(
    'import { useTheme } from "@/components/providers/ThemeProvider";',
    'import { useTheme } from "@/components/providers/ThemeProvider";\r\nimport { IdeaBinBrand } from "@/components/ui/IdeaBinBrand";'
  );
  if (!navbarContent.includes("IdeaBinBrand")) {
    navbarContent = navbarContent.replace(
      'import { useTheme } from "@/components/providers/ThemeProvider";',
      'import { useTheme } from "@/components/providers/ThemeProvider";\nimport { IdeaBinBrand } from "@/components/ui/IdeaBinBrand";'
    );
  }
}

// Replace Logo + Brand Name block in Navbar
const oldNavBrandRegex = /<Link[\s\S]*?aria-label="IdeaBin Home"[\s\S]*?>[\s\S]*?<\/Link>/;
const newNavBrand = `<Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex items-center pl-1.5 sm:pl-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full cursor-pointer"
              aria-label="IdeaBin Home"
            >
              <IdeaBinBrand size="sm" />
            </Link>`;

if (oldNavBrandRegex.test(navbarContent)) {
  navbarContent = navbarContent.replace(oldNavBrandRegex, newNavBrand);
  fs.writeFileSync(navbarPath, navbarContent, "utf8");
  console.log("Navbar.tsx successfully updated with IdeaBinBrand!");
} else {
  console.error("Could not find brand block in Navbar.tsx");
}

// 2. Update SiteFooter.tsx
const footerPath = path.join(__dirname, "../src/components/sections/SiteFooter.tsx");
let footerContent = fs.readFileSync(footerPath, "utf8");

// Add import if not present
if (!footerContent.includes("IdeaBinBrand")) {
  footerContent = footerContent.replace(
    'import { usePrefersReducedMotion } from "@/lib/performance";',
    'import { usePrefersReducedMotion } from "@/lib/performance";\r\nimport { IdeaBinBrand } from "@/components/ui/IdeaBinBrand";'
  );
  if (!footerContent.includes("IdeaBinBrand")) {
    footerContent = footerContent.replace(
      'import { usePrefersReducedMotion } from "@/lib/performance";',
      'import { usePrefersReducedMotion } from "@/lib/performance";\nimport { IdeaBinBrand } from "@/components/ui/IdeaBinBrand";'
    );
  }
}

// Replace footer brand block
const oldFooterBrandRegex = /<div className="flex items-center gap-3 mb-4">[\s\S]*?src="\/ideabin_logo_black\.png"[\s\S]*?<\/div>/;
const newFooterBrand = `<div className="mb-4">
               <Link
                 href="/"
                 onClick={(e) => {
                   e.preventDefault();
                   window.scrollTo({ top: 0, behavior: "smooth" });
                 }}
                 className="group inline-flex select-none focus-visible:outline-none cursor-pointer"
                 aria-label="IdeaBin Home"
               >
                 <IdeaBinBrand size="lg" showTagline={true} taglineSize="md" />
               </Link>
             </div>`;

if (oldFooterBrandRegex.test(footerContent)) {
  footerContent = footerContent.replace(oldFooterBrandRegex, newFooterBrand);
} else {
  console.error("Could not match old footer brand block");
}

// Update bottom watermark typography to use font-sora and lowercase ideabin with orange-gold bin gradient
const oldWatermarkRegex = /<span[\s\S]*?className=\{`text-\[17vw\][\s\S]*?IdeaBin[\s\S]*?<\/span>/;
const newWatermark = `<span
            className="text-[17vw] sm:text-[18vw] lg:text-[19vw] font-sora font-semibold tracking-[-0.035em] leading-[0.85] select-none lowercase transition-colors duration-500 inline-flex items-baseline"
          >
            <span className={isDark ? "text-white/20" : "text-black/15"}>idea</span>
            <span className="bg-gradient-to-r from-[#FACC15]/30 via-[#FB923C]/30 to-[#F97316]/30 bg-clip-text text-transparent">bin</span>
          </span>`;

if (oldWatermarkRegex.test(footerContent)) {
  footerContent = footerContent.replace(oldWatermarkRegex, newWatermark);
} else {
  console.log("Note: bottom watermark regex did not match directly");
}

fs.writeFileSync(footerPath, footerContent, "utf8");
console.log("SiteFooter.tsx successfully updated with IdeaBinBrand!");
