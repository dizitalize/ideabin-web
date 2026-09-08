export const site = {
  name: "Prism Media Co.",
  tagline: "IT Solutions · Interactive Websites · Data Security",
  description:
    "Prism Media Co. delivers enterprise IT solutions, interactive website development, data security, cloud architecture, and custom software engineering.",
  url: "https://prismmedia.co",
  email: "hello@prismmedia.co",
  locale: "en_US",
  keywords: [
    "IT solutions company",
    "interactive website development",
    "data security & cybersecurity",
    "cloud infrastructure & devops",
    "custom software development",
    "enterprise IT services",
  ],
} as const;

export const trustInfo = {
  headline: "Trusted by Prestigious Firms & Industry Leaders",
  tagline: "Enterprise IT Security & High-Performance Engineering",
  description:
    "Empowering prestigious organizations worldwide with mission-critical web applications, zero-trust data security, and scalable cloud infrastructure.",
  stats: [
    { label: "Uptime SLA", value: "99.99%" },
    { label: "Data Protection", value: "ISO 27001" },
    { label: "Active Deployments", value: "500+" },
    { label: "Managed Support", value: "24/7 SLA" },
  ],
} as const;

export const journeyStops = [
  { id: "hero", label: "01", name: "Overview", title: "IT Solutions" },
  { id: "ad-break", label: "02", name: "Transition", title: "Ad break" },
  { id: "services", label: "03", name: "Services", title: "Core Capabilities" },
  { id: "work", label: "04", name: "Work", title: "Portfolio" },
  { id: "process", label: "05", name: "Process", title: "How we ship" },
  { id: "faq", label: "06", name: "FAQ", title: "Answers" },
  { id: "contact", label: "07", name: "Contact", title: "Begin" },
] as const;

export const services = [
  {
    title: "Interactive Websites & Web Apps",
    description:
      "High-performance, dynamic web platforms with sleek interfaces, modern interactive UX, and lightning-fast speed.",
  },
  {
    title: "Data Security & Cybersecurity",
    description:
      "Enterprise encryption, vulnerability management, threat detection, and comprehensive data protection protocols.",
  },
  {
    title: "Digital Marketing & Growth",
    description:
      "Full-funnel growth campaigns — technical SEO, targeted Google Ads, professional video shoot & editing, and social media handling.",
  },
  {
    title: "Custom Software & AI Solutions",
    description:
      "Bespoke enterprise software, intelligent API integrations, and AI-driven automation built to scale operations.",
  },
  {
    title: "AI & LLM Engineering",
    description:
      "Fine-tuned language models, retrieval-augmented generation pipelines, and autonomous agent orchestration for production workloads.",
  },
  {
    title: "Performance & Speed Engineering",
    description:
      "End-to-end performance auditing, Core Web Vitals optimization, edge caching, and asset pipeline tuning for sub-second experiences.",
  },
  {
    title: "Growth & Data Science",
    description:
      "Cohort analysis, funnel experimentation, attribution modeling, and data-informed growth loops that compound over time.",
  },
  {
    title: "DevOps & Cloud Infrastructure",
    description:
      "Infrastructure-as-code, automated CI/CD, cloud scaling, observability, and incident runbooks for resilient deployments.",
  },
  {
    title: "Support & Maintenance",
    description:
      "SLA-backed patches, ongoing support, knowledge transfer, and quarterly engineering reviews to keep systems healthy.",
  },
];

export const showcaseImages = {
  about: "/frames/webp/frame_0028.webp",
  portfolio: [
    {
      tag: "CORE IT SOLUTIONS",
      title: "Services",
      href: "#services",
      image: "/frames/webp/frame_0048.webp",
      caption: "Interactive websites, data security, digital marketing & custom AI software.",
    },
    {
      tag: "PORTFOLIO & CASE STUDIES",
      title: "Our Work",
      href: "#work",
      image: "/frames/webp/frame_0065.webp",
      caption: "Explore our featured enterprise web applications & security builds.",
    },
    {
      tag: "CLIENT TRUST & REVIEWS",
      title: "Client Feedback",
      href: "#feedback",
      image: "/frames/webp/frame_0090.webp",
      caption: "Trusted by prestigious firms & global enterprise leaders worldwide.",
    },
  ],
} as const;

export const faqs = [
  {
    q: "What IT services does Prism Media Co. provide?",
    a: "We specialize in interactive website development, enterprise data security & cybersecurity, cloud infrastructure setup, and custom software engineering.",
  },
  {
    q: "How do you ensure data security and compliance?",
    a: "We implement end-to-end encryption, multi-layered firewall defense, automated vulnerability scans, and strict compliance standards tailored to your industry.",
  },
  {
    q: "Can you build custom interactive websites and web portals?",
    a: "Yes. We design and build ultra-fast, interactive web applications featuring custom micro-animations, real-time data handling, and robust backend integrations.",
  },
  {
    q: "How fast can you deploy our IT solution or web platform?",
    a: "Most custom web platforms and IT infrastructure projects ship within 4 to 8 weeks, including thorough security testing and cloud deployment.",
  },
];
