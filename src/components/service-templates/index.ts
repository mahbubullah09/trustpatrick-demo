import type { ComponentType } from 'react';
import type { Expert } from '@/lib/api';

// ── Shared props every service template receives ──────────────────────────────
export interface ServiceTemplateProps {
  city:                 string;
  region:               string;
  regionCode:           string;
  initialExperts:       Expert[];
  zipCodes:             string[];
  serviceCategoryCodes: string[];
  ctaText:              string;
  cacheKey:             string;
}

// ── Registry: service slug → template component ───────────────────────────────
// To add a new service: create the template file, then add one line here.
import AsphaltTemplate from './AsphaltTemplate';
import ConcreteTemplate from './ConcreteTemplate';
import GravelTemplate from './GravelTemplate';

export const serviceTemplates: Record<string, ComponentType<ServiceTemplateProps>> = {
  'asphalt-paving-companies':    AsphaltTemplate,
  'concrete-companies':          ConcreteTemplate,
  'gravel-driveway-contractors': GravelTemplate,
};
