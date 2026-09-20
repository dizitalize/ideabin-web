import { MetadataRoute } from 'next'
import { seoServices } from '@/lib/seo-data'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceUrls = seoServices.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: site.url,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${site.url}/services`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${site.url}/testimonials`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${site.url}/blog`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...serviceUrls,
  ]
}
