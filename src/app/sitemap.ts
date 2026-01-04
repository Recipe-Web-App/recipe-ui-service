import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const lastModified = new Date();

  // Homepage
  const homepage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Main sections (priority 0.9)
  const mainSections = [
    '/home',
    '/recipes',
    '/meal-plans',
    '/collections',
    '/feed',
    '/shopping-lists',
    '/sous-chef',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Section subpages (priority 0.8)
  const sectionSubpages = [
    // Recipes
    '/recipes/create',
    '/recipes/favorites',
    '/recipes/my-recipes',
    '/recipes/popular',
    '/recipes/shared',
    '/recipes/trending',
    // Meal plans
    '/meal-plans/create',
    '/meal-plans/favorites',
    '/meal-plans/my-plans',
    '/meal-plans/shared',
    '/meal-plans/trending',
    // Collections
    '/collections/create',
    '/collections/favorites',
    '/collections/my-collections',
    '/collections/shared',
    '/collections/trending',
    // Feed
    '/feed/co-chefs',
    '/feed/discover',
    '/feed/my-activity',
    // Shopping lists
    '/shopping-lists/create',
    // Sous chef
    '/sous-chef/adapt',
    '/sous-chef/cook',
    '/sous-chef/timers',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Account pages (priority 0.7)
  const accountPages = [
    '/account',
    '/account/edit',
    '/account/profile',
    '/account/settings',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Auth pages (priority 0.6)
  const authPages = ['/login', '/register'].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...homepage,
    ...mainSections,
    ...sectionSubpages,
    ...accountPages,
    ...authPages,
  ];
}
