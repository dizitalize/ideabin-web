import { services, site } from "@/lib/site";
import { faqItems } from "@/lib/faq-data";

function JsonLdScript({ id, payload }: { id: string; payload: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/ideabin_logo_black.png`,
      width: 1254,
      height: 1254,
    },
    email: site.email,
    description: site.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: site.email,
      availableLanguage: ["English"],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    description: site.description,
    serviceType: "IT Solutions & Digital Product Engineering",
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "IdeaBin Capabilities",
      itemListElement: services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  };

  return (
    <>
      <JsonLdScript id="ld-organization" payload={organization} />
      <JsonLdScript id="ld-website" payload={website} />
      <JsonLdScript id="ld-professional-service" payload={professionalService} />
    </>
  );
}

export function FaqJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLdScript id="ld-faq" payload={faqSchema} />;
}

export function ServiceJsonLd({
  slug,
  name,
  description,
}: {
  slug: string;
  name: string;
  description: string;
}) {
  const url = `${site.url}/services/${slug}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    areaServed: "Worldwide",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  };

  return (
    <>
      <JsonLdScript id="ld-service" payload={service} />
      <JsonLdScript id="ld-breadcrumb" payload={breadcrumb} />
    </>
  );
}
