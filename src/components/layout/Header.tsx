'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleMobileMenu, closeMobileMenu, openSearchDrawer } from '@/store/slices/uiSlice';
import { selectMobileMenuOpen, selectSearchDrawerOpen } from '@/store/selectors';
import { services } from '@/data/services';
import SearchWidget from '@/components/search/SearchWidget';

export default function Header() {
  const dispatch        = useAppDispatch();
  const mobileOpen      = useAppSelector(selectMobileMenuOpen);
  const drawerOpen      = useAppSelector(selectSearchDrawerOpen);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" onClick={() => dispatch(closeMobileMenu())}
              className="flex items-center gap-2 shrink-0">
              <span className="font-heading font-black text-xl text-brand-navy">
                Trust<span className="text-brand-blue">Patrick</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`}
                  className="text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">
                  {s.shortName}
                </Link>
              ))}
              <Link href="/about"
                className="text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">
                About
              </Link>
            </nav>

            {/* Desktop CTA + search icon */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => dispatch(openSearchDrawer())}
                aria-label="Search"
                className="p-2 text-brand-gray hover:text-brand-blue transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link href="/" className="btn-orange text-sm py-2">
                Get Free Estimates
              </Link>
            </div>

            {/* Mobile buttons */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => dispatch(openSearchDrawer())}
                aria-label="Search"
                className="p-2 text-brand-gray hover:text-brand-blue transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button onClick={() => dispatch(toggleMobileMenu())}
                aria-label="Toggle menu"
                className="p-2 rounded-md text-brand-gray hover:text-brand-navy">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile nav menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}
                onClick={() => dispatch(closeMobileMenu())}
                className="block text-sm font-medium text-brand-gray hover:text-brand-blue py-2 border-b border-gray-50">
                {s.name}
              </Link>
            ))}
            <Link href="/about" onClick={() => dispatch(closeMobileMenu())}
              className="block text-sm font-medium text-brand-gray hover:text-brand-blue py-2 border-b border-gray-50">
              About
            </Link>
            <Link href="/" onClick={() => dispatch(closeMobileMenu())}
              className="btn-orange text-sm w-full justify-center mt-3">
              Get Free Estimates
            </Link>
          </div>
        )}
      </header>

      {/* Search drawer overlay */}
      {drawerOpen && <SearchDrawer />}
    </>
  );
}

function SearchDrawer() {
  const dispatch    = useAppDispatch();
  const drawerOpen  = useAppSelector(selectSearchDrawerOpen);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch({ type: 'ui/closeSearchDrawer' })}
      />

      {/* Drawer panel */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl
        transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-heading font-bold text-brand-navy text-lg">Find Contractors</h2>
          <button
            onClick={() => dispatch({ type: 'ui/closeSearchDrawer' })}
            className="p-2 text-brand-gray hover:text-brand-navy rounded-md"
            aria-label="Close search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">
          <SearchWidget compact />
        </div>
      </div>
    </>
  );
}
