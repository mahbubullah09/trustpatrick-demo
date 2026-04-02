import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TrustPatrick privacy policy — how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      body: `When you use TrustPatrick to find a contractor, we collect the information you provide directly — including your name, email address, phone number, zip code, and project details. We also collect standard web analytics data (pages visited, browser type, referring URL) to improve the site.`,
    },
    {
      title: 'How We Use Your Information',
      body: `We use your information solely to connect you with vetted contractors who serve your area. We share your contact details with up to 3 matched contractors so they can provide estimates. We do not sell your personal information to third parties or advertisers.`,
    },
    {
      title: 'Cookies',
      body: `TrustPatrick uses essential cookies for site functionality (remembering your search preferences) and analytics cookies to understand how visitors use the site. You can disable cookies in your browser settings, though some features may not work correctly.`,
    },
    {
      title: 'Data Retention',
      body: `We retain your information for as long as necessary to fulfill the purpose it was collected for. If you would like your data deleted, contact us at support@trustpatrick.com and we will process your request within 30 days.`,
    },
    {
      title: 'Your Rights',
      body: `You have the right to access, correct, or delete personal information we hold about you. To exercise these rights, contact support@trustpatrick.com. If you are a California resident, you have additional rights under CCPA.`,
    },
    {
      title: 'Contact',
      body: `Questions about this privacy policy? Email us at support@trustpatrick.com.`,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className=" text-4xl font-black text-brand-navy mb-2">Privacy Policy</h1>
      <p className="text-brand-gray text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-8">
        {sections.map(({ title, body }) => (
          <section key={title}>
            <h2 className=" font-bold text-lg text-brand-navy mb-2">{title}</h2>
            <p className="text-brand-gray text-sm leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
