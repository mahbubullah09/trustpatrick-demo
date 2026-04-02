import type { Metadata } from 'next';
import SearchWidget from '@/components/search/SearchWidget';
import ServiceCards from '@/components/home/ServiceCards';
import TrustBadges from '@/components/home/TrustBadges';

export const metadata: Metadata = {
  title: 'TrustPatrick — Find Trusted Local Contractors',
  description:
    'Find vetted asphalt and concrete driveway contractors near you. Search by city or state, compare local pros, and get free estimates.',
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className=" text-4xl md:text-5xl font-black mb-4 leading-tight">
            Find Trusted Driveway <br className="hidden md:block" />
            Contractors Near You
          </h1>
          <p className="text-white/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Compare vetted asphalt and concrete pros in your city. Free estimates, real reviews,
            zero spam.
          </p>

          {/* Search widget */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-left">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <TrustBadges />

      {/* Service cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="section-title text-center mb-10">Choose Your Driveway Service</h2>
        <ServiceCards />
      </section>

      {/* How it works */}
      <section className="bg-brand-light py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-title mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Search Your Area', desc: 'Enter your city or state to find contractors near you.' },
              { step: '2', title: 'Pick a Service', desc: 'Choose asphalt, concrete, or another driveway service.' },
              { step: '3', title: 'Compare Pros', desc: 'Browse up to 6 vetted contractors with ratings and reviews.' },
              { step: '4', title: 'Get Estimates', desc: 'Contact pros directly for free, no-obligation quotes.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-action text-white  font-black text-xl flex items-center justify-center shadow-md">
                  {step}
                </div>
                <h3 className=" font-bold text-brand-navy">{title}</h3>
                <p className="text-sm text-brand-gray">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
