export interface SEOService {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
}

export const seoServices: SEOService[] = [
  {
    slug: "software-development",
    title: "Custom Software Development Company in India | Ideabin.tech",
    shortTitle: "Custom Software Development",
    description: "Expert custom software development company in India specializing in bespoke enterprise solutions, cloud architecture, and scalable web applications.",
    keywords: ["custom software development India", "software company Coimbatore", "enterprise software solutions", "bespoke software developers"],
  },
  {
    slug: "saas-development",
    title: "SaaS Development Company in India | B2B SaaS MVP | Ideabin.tech",
    shortTitle: "SaaS Development",
    description: "Top SaaS development company in India. We build secure, multi-tenant SaaS products and MVPs for startups and global enterprises.",
    keywords: ["SaaS development company India", "SaaS MVP development", "multi-tenant SaaS architecture", "build SaaS product"],
  },
  {
    slug: "ai-development",
    title: "AI Software Development Company in India | GenAI & RAG | Ideabin.tech",
    shortTitle: "AI Development",
    description: "Leading AI development company in India providing Generative AI solutions, custom RAG pipelines, and intelligent automation for businesses.",
    keywords: ["AI development company India", "generative AI solutions", "RAG application development", "AI software automation"],
  },
  {
    slug: "web-development",
    title: "Interactive Web Development Company in Coimbatore | Ideabin.tech",
    shortTitle: "Web Development",
    description: "Premium web development company in Coimbatore crafting high-performance, cinematic, and interactive Next.js web applications.",
    keywords: ["web development company Coimbatore", "interactive website development", "Next.js development agency", "cinematic web experiences"],
  },
  {
    slug: "seo-services",
    title: "SEO Company in Coimbatore | Technical & Local SEO | Ideabin.tech",
    shortTitle: "SEO Services",
    description: "Data-driven SEO company in Coimbatore offering technical SEO, local SEO, and organic growth strategies for software and tech companies.",
    keywords: ["SEO company Coimbatore", "technical SEO agency", "local SEO Coimbatore", "digital marketing for software companies"],
  }
];

export function getSEOServiceBySlug(slug: string): SEOService | undefined {
  return seoServices.find(service => service.slug === slug);
}
