import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://senpekmezcihukuk.com',
      lastModified: new Date(),
    },
    // Diğer sayfalarınızı buraya ekleyebilirsiniz:
    {
      url: 'https://senpekmezcihukuk.com/hakkimizda',
      lastModified: new Date(),
    },
  ]
}