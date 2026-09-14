const fs = require("fs");
const path = require("path");

const footerPath = path.join(__dirname, "../src/components/sections/SiteFooter.tsx");
let content = fs.readFileSync(footerPath, "utf8");

// Add IdeaBinBrand import
if (!content.includes("IdeaBinBrand")) {
  content = content.replace(
    'import { usePrefersReducedMotion } from "@/lib/performance";',
    'import { usePrefersReducedMotion } from "@/lib/performance";\r\nimport { IdeaBinBrand } from "@/components/ui/IdeaBinBrand";'
  );
  if (!content.includes("IdeaBinBrand")) {
    content = content.replace(
      'import { usePrefersReducedMotion } from "@/lib/performance";',
      'import { usePrefersReducedMotion } from "@/lib/performance";\nimport { IdeaBinBrand } from "@/components/ui/IdeaBinBrand";'
    );
  }
}

// Replace IdeaBinLogo function
const oldFunctionRegex = /\/\/ Logo mark matching design system[\s\S]*?function IdeaBinLogo[\s\S]*?return \([\s\S]*?<\/div>\s*\);\s*\}/;
const newFunction = `// Logo mark matching design system with Sora font & fluid ribbon emblem
function IdeaBinLogo() {
  return (
    <div className="flex flex-col">
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="group inline-flex select-none focus-visible:outline-none cursor-pointer"
        aria-label="IdeaBin Home"
      >
        <IdeaBinBrand size="lg" showTagline={true} taglineSize="sm" />
      </Link>
    </div>
  );
}`;

if (oldFunctionRegex.test(content)) {
  content = content.replace(oldFunctionRegex, newFunction);
} else {
  console.error("Could not match old IdeaBinLogo function");
}

// Replace watermark
const oldWatermarkRegex = /<span[\s\S]*?className=\{`text-\[17vw\][\s\S]*?IdeaBin[\s\S]*?<\/span>/;
const newWatermark = `<span
            className="text-[17vw] sm:text-[18vw] lg:text-[19vw] font-sora font-semibold tracking-[-0.035em] leading-[0.85] select-none lowercase transition-colors duration-500 inline-flex items-baseline"
          >
            <span className={isDark ? "text-white/20" : "text-black/15"}>idea</span>
            <span className="bg-gradient-to-r from-[#FACC15]/40 via-[#FB923C]/40 to-[#F97316]/40 bg-clip-text text-transparent">bin</span>
          </span>`;

if (oldWatermarkRegex.test(content)) {
  content = content.replace(oldWatermarkRegex, newWatermark);
} else {
  console.log("Could not match old watermark");
}

// In line 121, change <IdeaBinLogo isDark={isDark} /> to <IdeaBinLogo />
content = content.replace("<IdeaBinLogo isDark={isDark} />", "<IdeaBinLogo />");

fs.writeFileSync(footerPath, content, "utf8");
console.log("SiteFooter.tsx updated successfully!");
