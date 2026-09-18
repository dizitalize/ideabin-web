import { notFound } from 'next/navigation';
import { getSEOServiceBySlug, seoServices } from '@/lib/seo-data';
import Link from 'next/link';
import { Metadata } from 'next';

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
    };
  }

  return {
    title: service.title,
    description: service.description,
    keywords: service.keywords.join(', '),
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
      <div className="max-w-3xl mx-auto">
        <Link href="/services" className="text-sm text-zinc-400 hover:text-white transition-colors mb-8 inline-block">
          &larr; Back to Services
        </Link>
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
            <p className="text-zinc-400 mb-6">Get in touch with our experts to discuss your requirements.</p>
            <Link 
              href="/#contact"
              className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
