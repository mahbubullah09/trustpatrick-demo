import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCompanyBySlug, type CompanyService } from '@/lib/api';
import ServiceAreasList from '@/components/company/ServiceAreasList';
import GalleryGrid from '@/components/company/GalleryGrid';

/** Strip all HTML tags and decode basic HTML entities */
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await fetchCompanyBySlug(slug);
  if (!company) return {};

  const title = `${company.company_name} — TrustPatrick`;
  const description = stripHtml(company.company_bio).slice(0, 160) ||
    `View the profile of ${company.company_name} on TrustPatrick.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `https://trustpatrick.com/pros/${slug}` },
    alternates: { canonical: `https://trustpatrick.com/pros/${slug}` },
  };
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`${cls} ${i <= Math.round(rating) ? 'text-brand-gold' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Build grouped services: type → main_category → [service_category]
function groupServices(services: CompanyService[]) {
  const map = new Map<number, {
    label: string;
    mains: Map<number, { label: string; items: string[] }>;
  }>();

  for (const s of services) {
    if (!map.has(s.service_category_type_id)) {
      map.set(s.service_category_type_id, { label: s.service_category_type, mains: new Map() });
    }
    const type = map.get(s.service_category_type_id)!;
    if (!type.mains.has(s.main_category_id)) {
      type.mains.set(s.main_category_id, { label: s.main_category, items: [] });
    }
    type.mains.get(s.main_category_id)!.items.push(s.service_category);
  }

  return map;
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = await fetchCompanyBySlug(slug);

  if (!company) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className=" text-2xl font-black text-brand-navy mb-3">
            Company Not Found
          </h1>
          <p className="text-brand-gray mb-2">
            We don&apos;t have any data about this company in our database.
          </p>
          <p className="text-sm text-brand-gray mb-8">
            This is not an official TrustPatrick recommended contractor.
          </p>
          <Link href="/find-contractors"
            className="btn-primary inline-flex">
            Browse Verified Contractors
          </Link>
        </div>
      </div>
    );
  }

  const isActive = company.status?.toLowerCase() === 'active';
  const rating = company.averageratings?.rating ?? 0;
  const groupedServices = groupServices(company.services ?? []);
  const bio = stripHtml(company.company_bio);

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <div className="bg-hero-gradient text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-white/75 mb-5 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/find-contractors" className="hover:text-white transition-colors">Contractors</Link>
            <span>/</span>
            <span className="text-white">{company.company_name}</span>
          </nav>

          <div className="flex items-start gap-5">
            {/* Logo / Initials */}
            <div className="shrink-0">
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logo} alt={company.company_name}
                  className="w-20 h-20 rounded-xl object-contain bg-white border-2 border-white/20 p-1" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center  font-black text-2xl text-white">
                  {company.initials ?? company.company_name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className=" text-3xl md:text-4xl font-black mb-2 leading-tight">
                {company.company_name}
              </h1>

              {/* Verified badge */}
              <div className={`inline-flex items-center gap-2 text-sm font-medium mb-3 ${isActive ? 'text-green-300' : 'text-red-300'}`}>
                {isActive ? (
                  <>
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Official TrustPatrick Recommended Company
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Not a TrustPatrick Recommended Company
                  </>
                )}
              </div>

              <p className="text-white/75 text-sm">
                {company.company_mailing_address && `${company.company_mailing_address}, `}
                {company.city}, {company.state_name} {company.zipcode}
              </p>

              {rating > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-2xl  font-black text-white">{rating.toFixed(1)}</span>
                  <StarRating rating={rating} size="lg" />
                  <span className="text-white/75 text-sm">({company.reviews?.length ?? 0} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab anchors ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-0 text-sm font-semibold whitespace-nowrap">
            {[
              ['About', '#about'],
              ['Services', '#service-offered'],
              ['Gallery', '#gallery'],
              ['Reviews', '#reviews'],
              ['Complaints', '#complaints'],
              ['Service Areas', '#service-areas'],
            ].map(([label, href]) => (
              <a key={href} href={href}
                className="px-4 py-3.5 text-brand-gray hover:text-brand-navy border-b-2 border-transparent hover:border-brand-action transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            {bio && (
              <section id="about" className="card p-6">
                <h2 className=" font-bold text-brand-navy text-xl mb-3">
                  About {company.company_name}
                </h2>
                <p className="text-brand-gray leading-relaxed">{bio}</p>
              </section>
            )}

            {/* Services Offered */}
            {groupedServices.size > 0 && (
              <section id="service-offered" className="card p-6">
                <h2 className=" font-bold text-brand-navy text-xl mb-5">Services Offered</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Array.from(groupedServices.values()).map((type) => (
                    <div key={type.label}>
                      <h3 className="text-sm  font-bold text-brand-navy uppercase tracking-wider mb-3 pb-1.5 border-b border-gray-100">
                        {type.label}
                      </h3>
                      {Array.from(type.mains.values()).map((main) => (
                        <div key={main.label} className="mb-3">
                          <p className="text-xs font-semibold text-brand-action bg-brand-light px-3 py-1.5 rounded-md mb-1.5">
                            {main.label}
                          </p>
                          <ul className="space-y-1 pl-3">
                            {main.items.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-xs text-brand-gray">
                                <span className="w-1 h-1 rounded-full bg-brand-gold shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {company.gallery?.length > 0 && (
              <section id="gallery" className="card p-6">
                <h2 className=" font-bold text-brand-navy text-xl mb-5">Photo Gallery</h2>
                <GalleryGrid items={company.gallery} />
              </section>
            )}

            {/* Reviews */}
            <section id="reviews" className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className=" font-bold text-brand-navy text-xl">
                  Customer Reviews
                  <span className="ml-2 text-sm  font-normal text-brand-gray">
                    ({company.reviews?.length ?? 0})
                  </span>
                </h2>
                {rating > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl  font-black text-brand-navy">{rating.toFixed(1)}</span>
                    <StarRating rating={rating} size="md" />
                  </div>
                )}
              </div>

              {company.reviews?.length > 0 ? (
                <div className="space-y-5">
                  {company.reviews.map((review, i) => (
                    <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand-action  font-bold text-sm shrink-0">
                            {review.customer_name?.charAt(0) ?? '?'}
                          </div>
                          <p className="font-semibold text-brand-navy text-sm">{review.customer_name}</p>
                        </div>
                        <StarRating rating={review.ratings} size="sm" />
                      </div>
                      <p className="text-sm text-brand-gray leading-relaxed pl-12">{stripHtml(review.content)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-brand-gray">No reviews yet.</p>
              )}
            </section>

            {/* Complaints */}
            <section id="complaints" className="card p-6">
              <h2 className=" font-bold text-brand-navy text-xl mb-5">
                Customer Complaints
                <span className="ml-2 text-sm  font-normal text-brand-gray">
                  ({company.complaints?.length ?? 0})
                </span>
              </h2>

              {company.complaints?.length > 0 ? (
                <div className="space-y-5">
                  {company.complaints.map((c, i) => (
                    <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500  font-bold text-sm shrink-0">
                          {c.customer_name?.charAt(0) ?? '?'}
                        </div>
                        <p className="font-semibold text-brand-navy text-sm">{c.customer_name}</p>
                      </div>
                      <p className="text-sm text-brand-gray leading-relaxed pl-12">{stripHtml(c.content)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No complaints on record — great sign!
                </p>
              )}
            </section>

            {/* Service Areas */}
            {company.service_areas?.length > 0 && (
              <section id="service-areas" className="card p-6">
                <h2 className=" font-bold text-brand-navy text-xl mb-5">
                  Service Areas
                  <span className="ml-2 text-sm  font-normal text-brand-gray">
                    ({company.service_areas.length} zip codes)
                  </span>
                </h2>
                <ServiceAreasList areas={company.service_areas} />
              </section>
            )}

          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-16 lg:self-start">

            {/* Contact card */}
            <div className="card p-6">
              <h3 className=" font-bold text-brand-navy mb-4 text-base">Contact</h3>
              <ul className="space-y-3 text-sm text-brand-gray">
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 mt-0.5 text-brand-action shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{company.city}, {company.state_name} {company.zipcode}</span>
                </li>
              </ul>

              <a href={`https://pros.trustpatrick.com/get-listed/?ref=${company.slug}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-5 block w-full text-center bg-cta-gradient text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm shadow-md">
                Request an Estimate
              </a>
            </div>

            {/* Trust badges */}
            <div className="bg-brand-navy text-white rounded-xl p-5">
              <h3 className=" font-bold text-white mb-4 text-base">Why TrustPatrick?</h3>
              <ul className="space-y-2.5 text-sm text-white/75">
                {[
                  'Every contractor is vetted',
                  'Real homeowner reviews',
                  'Free estimates — no obligation',
                  'No spam, ever',
                  'Licensed & insured pros only',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5 shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rating summary */}
            {rating > 0 && (
              <div className="card p-5">
                <h3 className=" font-bold text-brand-navy mb-3 text-base">Rating</h3>
                <div className="flex items-center gap-3">
                  <span className="text-4xl  font-black text-brand-navy">{rating.toFixed(1)}</span>
                  <div>
                    <StarRating rating={rating} size="md" />
                    <p className="text-xs text-brand-gray mt-1">{company.reviews?.length ?? 0} reviews</p>
                  </div>
                </div>
              </div>
            )}

            {/* Share / back */}
            <div className="card p-5">
              <Link href="/find-contractors"
                className="text-sm text-brand-action hover:underline flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Browse all contractors
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
