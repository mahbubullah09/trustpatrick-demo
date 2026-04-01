import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'TrustPatrick terms of service — the rules and guidelines for using our platform.',
};

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      body: `By accessing or using TrustPatrick, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site. We may update these terms at any time — continued use after changes constitutes acceptance.`,
    },
    {
      title: 'Use of the Service',
      body: `TrustPatrick is a contractor-matching directory for residential home improvement projects. You may use the platform to search for and contact contractors. You may not use the site for any unlawful purpose, to submit false information, or to interfere with the operation of the platform.`,
    },
    {
      title: 'Contractor Vetting',
      body: `We screen contractors for licensing and insurance status at the time of listing. We do not guarantee the quality, timeliness, or legality of any contractor's work. All contracts, agreements, and payments are solely between you and the contractor you hire.`,
    },
    {
      title: 'No Warranty',
      body: `TrustPatrick is provided "as is" without any warranty of any kind. We do not warrant that the service will be uninterrupted, error-free, or that any contractor listed will be available or suitable for your project.`,
    },
    {
      title: 'Limitation of Liability',
      body: `To the fullest extent permitted by law, TrustPatrick shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or your engagement with any contractor found through the site.`,
    },
    {
      title: 'Governing Law',
      body: `These terms are governed by the laws of the State of Colorado, without regard to conflict of law principles.`,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-heading text-4xl font-black text-brand-navy mb-2">Terms of Service</h1>
      <p className="text-brand-gray text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-8">
        {sections.map(({ title, body }) => (
          <section key={title}>
            <h2 className="font-heading font-bold text-lg text-brand-navy mb-2">{title}</h2>
            <p className="text-brand-gray text-sm leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
