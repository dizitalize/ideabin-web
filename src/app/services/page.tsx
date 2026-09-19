import Link from 'next/link';
import type { Metadata } from 'next';
import { seoServices } from '@/lib/seo-data';

const pageTitle = 'Our IT & Digital Services | Ideabin.tech';
const pageDescription =
  'Explore our comprehensive range of services including custom software development, AI solutions, web development, and technical SEO in India.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'IT services India',
    'software development company',
    'SaaS development',
    'AI development services',
    'web development Coimbatore',
    'SEO services',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    type: 'website',
    url: '/services',
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IdeaBin — Spatial 3D Web Experiences & IT Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/og-image.png'],
  },
};

export default function ServicesIndex() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-[#050505] text-white z-10 relative">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border border-white/12 bg-white/5 hover:border-white/30 text-zinc-300 hover:text-white transition-all duration-200 mb-8"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-orange-500">Our Services</h1>
        <p className="text-zinc-300 text-lg mb-12">
          We provide high-end digital engineering and SEO marketing services tailored for ambitious brands.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seoServices.map((service) => (
            <Link 
              key={service.slug} 
              href={`/services/${service.slug}`}
              className="block p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-3">{service.shortTitle}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
