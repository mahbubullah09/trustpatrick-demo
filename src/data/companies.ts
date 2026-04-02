import companiesData from './companies.json';

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function getAllCompanies(): { name: string; slug: string }[] {
  return (companiesData as string[]).map((name) => ({
    name,
    slug: slugify(name),
  }));
}

export function getCompanyBySlug(slug: string): { name: string; slug: string } | undefined {
  return getAllCompanies().find((c) => c.slug === slug);
}
