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
  [key: string]: unknown;
}

export interface ExpertsResponse {
  experts?: Expert[];
  company_details?: Expert[];
  total?: number;
}

const API_BASE_URL = 'https://pros.trustpatrick.com/api';

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
    });

    if (!res.ok) {
      console.error(`Experts API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: ExpertsResponse = await res.json();
    console.log('data',data)

    // Return max 6 as specified
    const all = Array.isArray(data) ? data : data.experts ?? data.company_details ?? [];
    return all.slice(0, 6);
  } catch (err) {
    console.error('fetchFeaturedExperts error:', err);
    return [];
  }
}
