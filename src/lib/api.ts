const API_BASE_URL = 'https://pros.trustpatrick.com/api';

// ── Projects by Location ─────────────────────────────────────────────────────

export interface LocationProject {
  title: string;
  service_category: string;
  city: string;
  state: string;
  project_date: string;
  timeframe: string;
  zipcode: string;
  project_details: string;
}

export async function fetchProjectsByLocation(
  serviceCategoryCodes: string[],
  zipCodes: string[]
): Promise<LocationProject[]> {
  try {
    const params = new URLSearchParams();
    zipCodes.forEach((zip) => params.append('zip_codes[]', zip));
    serviceCategoryCodes.forEach((code) => params.append('service_category_codes[]', code));

    const res = await fetch(`${API_BASE_URL}/projects_by_location?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.projects) ? data.projects : [];
  } catch {
    return [];
  }
}

// ── Additional Contractors ────────────────────────────────────────────────────

export interface AdditionalContractor {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export async function fetchAdditionalContractors(
  serviceCategoryCodes: string[],
  zipCodes: string[]
): Promise<AdditionalContractor[]> {
  try {
    const params = new URLSearchParams();
    zipCodes.forEach((zip) => params.append('zip_codes[]', zip));
    serviceCategoryCodes.forEach((code) => params.append('service_category_codes[]', code));

    const res = await fetch(`${API_BASE_URL}/additional_contractors?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.company_details) ? data.company_details : [];
  } catch {
    return [];
  }
}

// ── Company Profile ─────────────────────────────────────────────────────────

export interface CompanyReview {
  customer_name: string;
  ratings: number;
  content: string;
}

export interface CompanyComplaint {
  customer_name: string;
  content: string;
}

export interface CompanyGalleryItem {
  file_name: string;
  file_name_thumb: string;
}

export interface CompanyServiceArea {
  zip_code: string;
  city: string;
  state: string;
}

export interface CompanyService {
  service_category_type_id: number;
  service_category_type: string;
  main_category_id: number;
  main_category: string;
  service_category: string;
}

export interface CompanyProfile {
  company_name: string;
  slug: string;
  status: string;
  initials: string;
  logo: string | null;
  company_mailing_address: string;
  city: string;
  state_name: string;
  zipcode: string;
  company_bio: string | null;
  averageratings: { rating: number };
  reviews: CompanyReview[];
  complaints: CompanyComplaint[];
  gallery: CompanyGalleryItem[];
  service_areas: CompanyServiceArea[];
  services: CompanyService[];
}

export async function fetchCompanyBySlug(slug: string): Promise<CompanyProfile | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/company_by_slug?company_slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.error > 0) return null;
    return data.company as CompanyProfile;
  } catch {
    return null;
  }
}

// ── Experts ──────────────────────────────────────────────────────────────────

export interface Expert {
  id: string | number;
  slug?: string;
  business_name?: string;
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  city?: string;
  state?: string;
  zip?: string;
  rating?: number;
  review_count?: number;
  profile_image?: string;
  logo?: string;
  description?: string;
  years_in_business?: number;
  license_number?: string;
  is_insured?: boolean;
  services?: string[];
  recent_screening_date?: string;
  background_check_date?: string;
  review?: CompanyReview | CompanyReview[];
  [key: string]: unknown;
}

export interface ExpertsResponse {
  experts?: Expert[];
  company_details?: Expert[];
  total?: number;
}

export async function fetchFeaturedExperts(
  zipCodes: string[],
  serviceCategoryCodes: string[]
): Promise<Expert[]> {
  try {
    // Build query string — same logic as the PHP http_build_query
    const params = new URLSearchParams();
    zipCodes.forEach((zip) => params.append('zip_codes[]', zip));
    serviceCategoryCodes.forEach((code) => params.append('service_category_codes[]', code));

    const url = `${API_BASE_URL}/featured_experts?${params.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      // Revalidate every 5 minutes for ISR pages
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(`Experts API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: ExpertsResponse = await res.json();
    // Return max 6 as specified
    const all = Array.isArray(data) ? data : data.experts ?? data.company_details ?? [];
    return all.slice(0, 6);
  } catch (err) {
    console.error('fetchFeaturedExperts error:', err);
    return [];
  }
}
