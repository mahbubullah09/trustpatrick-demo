import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReduxProvider from '@/store/ReduxProvider';
import ToastContainer from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: {
    default: 'TrustPatrick — Find Trusted Home Improvement Contractors',
    template: '%s | TrustPatrick',
  },
  description:
    'Find vetted asphalt and concrete driveway contractors near you. Compare local pros, read reviews, and get free estimates.',
  metadataBase: new URL('https://trustpatrick.com'),
  openGraph: {
    type: 'website',
    siteName: 'TrustPatrick',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white">
        <ReduxProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
