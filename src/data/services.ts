export interface Service {
  slug: string;           // used in URL  e.g. "asphalt-paving-companies"
  name: string;           // display name
  shortName: string;      // short label  e.g. "Asphalt"
  description: string;   // SEO meta description template (use {city}, {region})
  h1Template: string;    // H1 template
  introParagraph: string; // Spintax-style intro — vary per service
  // API service category codes for this service
  serviceCategoryCodes: string[];
  // Page-specific CTA text
  ctaText: string;
}

export const services: Service[] = [
  {
    slug: 'asphalt-paving-companies',
    name: 'Asphalt Paving Companies',
    shortName: 'Asphalt',
    description:
      'Find trusted asphalt paving contractors near {city}, {region}. Compare vetted local pros, read reviews, and get free estimates today.',
    h1Template: 'Asphalt Paving Companies Near {city}, {region}',
    introParagraph:
      'Looking for reliable asphalt paving companies near {city}, {region}? Whether you need a new driveway installed, an old one repaired, or a complete resurfacing job, finding a contractor you can trust makes all the difference. We connect homeowners in {city} with vetted, reviewed asphalt professionals who stand behind their work.',
    serviceCategoryCodes: [
  '745-1R-2', '745-1R-3', '745-1R-4',
  '745-1C-2', '745-1C-3', '745-1C-4',
  '745-2R-2', '745-2R-3', '745-2R-4', '745-2R-5', '745-2R-6', '745-2R-7',
  '745-2C-2', '745-2C-3', '745-2C-4', '745-2C-5', '745-2C-6', '745-2C-7'
],
    ctaText: 'Get a Free Asphalt Estimate',
  },
  {
    slug: 'concrete-driveway-contractors',
    name: 'Concrete Driveway Contractors',
    shortName: 'Concrete',
    description:
      'Find trusted concrete driveway contractors near {city}, {region}. Compare vetted local pros, read reviews, and get free estimates today.',
    h1Template: 'Concrete Driveway Contractors Near {city}, {region}',
    introParagraph:
      'Searching for concrete driveway contractors in {city}, {region}? Concrete driveways are one of the most durable and long-lasting investments you can make for your home. Our directory connects {city} homeowners with licensed, insured concrete professionals who deliver quality results and transparent pricing.',
    serviceCategoryCodes: ['745-1C-2'],
    ctaText: 'Get a Free Concrete Estimate',
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Fill template placeholders */
export function fillTemplate(template: string, city: string, region: string): string {
  return template.replace(/\{city\}/g, city).replace(/\{region\}/g, region);
}
