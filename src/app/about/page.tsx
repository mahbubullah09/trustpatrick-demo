import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About TrustPatrick',
  description:
    'TrustPatrick was built to help homeowners find driveway contractors they can actually trust — no spam, no fake reviews, just vetted professionals.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className=" text-4xl md:text-5xl font-black text-brand-navy mb-4">
          About TrustPatrick
        </h1>
        <p className="text-brand-gray text-lg max-w-2xl mx-auto">
          We built TrustPatrick because hiring a contractor shouldn&apos;t feel like a gamble.
        </p>
      </div>

      {/* Story */}
      <div className="prose max-w-none space-y-6 text-brand-gray leading-relaxed mb-14">
        <p>
          TrustPatrick was founded after years of watching homeowners get burned — by low-ball bids
          that turned into horror stories, by contractors who vanished after a deposit, by online
          directories full of outdated listings and fake reviews.
        </p>
        <p>
          The premise is simple: <strong className="text-brand-navy">if we wouldn&apos;t send a contractor
          to our own family, we won&apos;t send them to you.</strong> Every professional listed on
          TrustPatrick has been screened for licensing, insurance, and genuine customer satisfaction
          before they appear in our results.
        </p>
        <p>
          We serve homeowners across all 50 states, covering asphalt, concrete, paver, and gravel
          driveway services. Our search connects you with up to six vetted local contractors — and
          you get free, no-obligation estimates with zero spam.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
        {[
          { value: '2,042+', label: 'Cities Covered' },
          { value: '27',     label: 'Services' },
          { value: '1,000+', label: 'Vetted Contractors' },
          { value: '50',     label: 'States' },
        ].map(({ value, label }) => (
          <div key={label} className="card p-5 text-center">
            <div className=" font-black text-3xl text-brand-action mb-1">{value}</div>
            <div className="text-sm text-brand-gray font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="bg-brand-light rounded-2xl p-8 mb-14">
        <h2 className=" font-bold text-2xl text-brand-navy mb-6 text-center">
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🔍',
              title: 'Vetted, Not Just Listed',
              desc: 'We manually review contractors before they appear in our directory. A license number and insurance certificate are the floor, not the ceiling.',
            },
            {
              icon: '🚫',
              title: 'No Spam. Ever.',
              desc: 'We match you with up to 3 contractors who are ready to help — not 15 companies competing to call you 40 times.',
            },
            {
              icon: '💬',
              title: 'Real Reviews',
              desc: 'Every review on TrustPatrick comes from a verified homeowner. We don\'t allow contractors to game their own ratings.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className=" font-bold text-brand-navy mb-2">{title}</h3>
              <p className="text-sm text-brand-gray leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className=" font-bold text-2xl text-brand-navy mb-4">
          Ready to Find a Contractor You Can Trust?
        </h2>
        <Link href="/" className="btn-orange px-10">
          Search Contractors Near You
        </Link>
      </div>
    </div>
  );
}
