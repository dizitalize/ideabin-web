import { notFound } from 'next/navigation';
import { getSEOServiceBySlug, seoServices } from '@/lib/seo-data';
import Link from 'next/link';
import { Metadata } from 'next';
import { ServiceJsonLd } from '@/components/seo/JsonLd';
import { site } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return seoServices.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getSEOServiceBySlug(slug);
  
  if (!service) {
    return {
      title: 'Service Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: service.title,
    description: service.description,
    keywords: service.keywords,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      type: 'website',
      url: `/services/${service.slug}`,
      title: service.title,
      description: service.description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${service.shortTitle} — IdeaBin`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.description,
      images: ['/og-image.png'],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getSEOServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-[#050505] text-white z-10 relative">
      <ServiceJsonLd
        slug={service.slug}
        name={service.shortTitle}
        description={service.description}
      />
      <div className="max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider">
            <li>
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li>
              <Link href="/services" className="text-zinc-400 hover:text-white transition-colors">
                Services
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li aria-current="page" className="text-orange-400">
              {service.shortTitle}
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
          {service.title.split('|')[0]}
        </h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-zinc-300 leading-relaxed mb-8">
            {service.description}
          </p>
          
          <h2 className="text-2xl font-semibold mt-12 mb-4 text-orange-400">Why choose us for {service.shortTitle}?</h2>
          <p className="text-zinc-400 mb-6">
            We employ modern architectures, zero-trust security protocols, and scalable frameworks to ensure your {service.shortTitle.toLowerCase()} project succeeds in competitive markets. Our team focuses heavily on performance optimization and reliable delivery.
          </p>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mt-12">
            <h3 className="text-xl font-medium mb-3 text-white">Ready to start your project?</h3>
            <p className="text-zinc-400 mb-6">
              Get in touch with our experts to discuss your requirements at{' '}
              <a href={`mailto:${site.email}`} className="text-orange-400 hover:text-orange-300 transition-colors">
                {site.email}
              </a>
              .
            </p>
            <Link 
              href="/#contact"
              className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all"
            >
              Contact Us Today
            </Link>
          </div>

          <div className="mt-16 border-t border-zinc-800 pt-10">
            <h2 className="text-2xl font-semibold mb-6 text-white">Explore Other Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seoServices
                .filter((sibling) => sibling.slug !== service.slug)
                .map((sibling) => (
                  <Link
                    key={sibling.slug}
                    href={`/services/${sibling.slug}`}
                    className="block p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-white">{sibling.shortTitle}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{sibling.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
