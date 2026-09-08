"use client";

import { site } from "@/lib/site";
import { useTheme } from "@/components/providers/ThemeProvider";

const nav = [
  { label: "Capabilities", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "FAQ", href: "#feedback" },
  { label: "Contact", href: "#contact" },
];

export default function SiteFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  return (
    <footer
      className={`relative border-t transition-colors duration-300 ${
        isDark ? "border-white/10 theme-bg" : "border-black/10 theme-surface"
      }`}
    >
      <div className="section-container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p
              className={`display max-w-[14ch] text-[2rem] md:text-[2.5rem] ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
              style={{ lineHeight: 1.05 }}
            >
              {site.name}
            </p>
            <p className={`body mt-3 max-w-[40ch] ${isDark ? "theme-fg-muted" : "theme-fg-muted"}`}>
              {site.tagline}.
            </p>
          </div>

          <nav
            className="md:col-span-3 flex flex-col gap-2.5"
            aria-label="Footer navigation"
          >
            {nav.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-cursor="hover"
                className={`text-[14px] font-medium transition-colors ${
                  isDark
                    ? "text-white/70 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="md:col-span-2 md:text-right">
            <a
              href={`mailto:${site.email}`}
              data-cursor="hover"
              className={`text-[14px] font-medium transition-colors ${
                isDark
                  ? "text-white hover:text-orange-400"
                  : "text-zinc-900 hover:text-orange-600"
              }`}
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div
        className={`border-t ${
          isDark ? "border-white/8" : "border-black/8"
        }`}
      >
        <div className="section-container py-5 flex flex-wrap items-center justify-between gap-3">
          <p className={`meta ${isDark ? "theme-fg-subtle" : "theme-fg-subtle"}`}>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className={`meta ${isDark ? "theme-fg-subtle" : "theme-fg-subtle"}`}>
            ISO 27001 · 99.99% uptime SLA · 24/7 support
          </p>
        </div>
      </div>
    </footer>
  );
}
