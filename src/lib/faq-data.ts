export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    title: "Capabilities & Engagements",
    items: [
      {
        id: "faq-services",
        question: "What core services does IdeaBin deliver?",
        answer:
          "We engineer spatial 3D web experiences, bespoke e-commerce platforms (Shopify & Headless), full-stack web applications, brand identities, and high-performance cloud infrastructure for visionary brands.",
      },
      {
        id: "faq-scroll-3d",
        question: "How do you achieve 60fps 3D scroll animations without lag?",
        answer:
          "We use pre-rendered WebP/JPG frame sequences rendered directly to HTML5 Canvas via requestAnimationFrame, decoupled from React state renders. With dual-channel preloading and direct DOM transforms, frame rates remain locked at a buttery 60fps across desktop and mobile.",
      },
      {
        id: "faq-timeline",
        question: "What is your typical project timeline?",
        answer:
          "Brand & interactive landing page sprints typically take 2–4 weeks. Complete full-stack web platforms, e-commerce stores, and enterprise 3D web applications generally range between 6–10 weeks depending on custom 3D asset pipelines and integration scope.",
      },
      {
        id: "faq-maintenance",
        question: "Do you offer ongoing retainer support and optimization?",
        answer:
          "Yes. We partner with clients long-term through dedicated maintenance, CRO (conversion rate optimization), performance tuning, security audits, and continuous feature development.",
      },
      {
        id: "faq-get-started",
        question: "How do we get started with IdeaBin?",
        answer:
          "Contact our creative directors directly. We'll review your project requirements, schedule an exploratory discovery session, and deliver an actionable technical roadmap and transparent scope estimate within 48 hours.",
      },
    ],
  },
];

export const faqItems: FaqItem[] = faqCategories.flatMap((category) => category.items);
