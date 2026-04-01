import Link from 'next/link';
import { services } from '@/data/services';
import { getAllRegions } from '@/data/locations';

export default function Footer() {
  const regions = getAllRegions().sort((a, b) => a.region_name.localeCompare(b.region_name));

  return (
    <footer className="bg-brand-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="font-heading font-black text-xl text-white">
                Trust<span className="text-brand-gold">Patrick</span>
              </span>
            </Link>
            <p className="text-sm text-blue-200 leading-relaxed">
              Connecting homeowners with vetted driveway contractors across the USA.
              No spam. No fake reviews. Just trusted pros.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Services</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}
                    className="text-sm text-blue-200 hover:text-white transition-colors">
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services"
                  className="text-sm text-blue-200 hover:text-white transition-colors">
                  All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Browse by State */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Browse by State</h4>
            <ul className="space-y-1.5 columns-2">
              {regions.map((r) => (
                <li key={r.region_code}>
                  <Link href={`/${r.region_code.toLowerCase()}`}
                    className="text-sm text-blue-200 hover:text-white transition-colors">
                    {r.region_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              {[
                ['About',          '/about'],
                ['Contact',        '/contact'],
                ['Sitemap',        '/sitemap-page'],
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/terms'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-white mt-6 mb-3 text-xs uppercase tracking-wider">For Contractors</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://pros.trustpatrick.com/get-listed/"
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-200 hover:text-white transition-colors">
                  Get Listed →
                </a>
              </li>
              <li>
                <a href="https://pros.trustpatrick.com/"
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-200 hover:text-white transition-colors">
                  Contractor Portal →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-blue-300">
            © {new Date().getFullYear()} TrustPatrick. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-blue-300">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/sitemap-page" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
