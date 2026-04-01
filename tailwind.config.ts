import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // TrustPatrick palette extracted from site
        brand: {
          navy:    '#1a2b4a',   // deep navy — primary text / header
          blue:    '#2563eb',   // action blue — CTAs
          orange:  '#f97316',   // accent orange — highlights
          gold:    '#f59e0b',   // warm gold — stars / trust badges
          light:   '#f0f4ff',   // very light blue — section bg
          gray:    '#6b7280',   // body text gray
          dark:    '#0f172a',   // near-black
          white:   '#ffffff',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a2b4a 0%, #2563eb 100%)',
        'cta-gradient':  'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
