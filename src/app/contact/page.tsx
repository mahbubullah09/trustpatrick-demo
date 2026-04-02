import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact TrustPatrick',
  description: 'Get in touch with the TrustPatrick team — homeowner support, contractor listings, and general enquiries.',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className=" text-4xl font-black text-brand-navy mb-3">Contact Us</h1>
      <p className="text-brand-gray mb-10">
        Have a question or need help? Fill out the form below and we&apos;ll get back to you within
        one business day.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Form */}
        <div className="md:col-span-2">
          <ContactForm />
        </div>

        {/* Info */}
        <aside className="space-y-6">
          {[
            { icon: '🏠', label: 'Homeowners', text: 'Need help finding a contractor or resolving an issue? We\'re here.' },
            { icon: '🔧', label: 'Contractors', text: 'Interested in getting listed? Visit our contractor portal.' },
            { icon: '📧', label: 'Email', text: 'support@trustpatrick.com' },
          ].map(({ icon, label, text }) => (
            <div key={label} className="flex gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="font-semibold text-brand-navy text-sm">{label}</div>
                <div className="text-sm text-brand-gray mt-0.5">{text}</div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
