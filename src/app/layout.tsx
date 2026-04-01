import type { Metadata } from 'next';
import { Merriweather, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReduxProvider from '@/store/ReduxProvider';
import ToastContainer from '@/components/ui/ToastContainer';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-heading',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

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
    <html lang="en" className={`${merriweather.variable} ${sourceSans.variable}`}>
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
