import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🛣️</div>
        <h1 className="font-heading text-4xl font-black text-brand-navy mb-3">
          Page Not Found
        </h1>
        <p className="text-brand-gray mb-8">
          This page doesn&apos;t exist or the location / service combination hasn&apos;t been added yet.
          Use the search below to find contractors near you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
          <Link href="/" className="btn-orange">
            Find Contractors
          </Link>
        </div>
      </div>
    </div>
  );
}
