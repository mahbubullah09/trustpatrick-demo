import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // TrustPatrick palette — all shades derived from primary #001b33
        brand: {
          // ── Primary scale (dark → light) ──
          darker:  '#000d18',   // deepest — top bar bg
          dark:    '#001424',   // footer bg
          navy:    '#001b33',   // PRIMARY — base color
          mid:     '#002d54',   // cards, sidebar panels
          muted:   '#1a4a6e',   // secondary text on dark bg / borders
          action:  '#1a5a8a',   // CTAs, links, buttons — lighter navy shade
          soft:    '#2e6f9e',   // hover on action
          // ── Tints ──
          light:   '#e8f1f8',   // section bg — very light tint of primary
          pale:    '#f0f5fa',   // card bg, inputs
          // ── Accents (kept minimal) ──
          orange:  '#f97316',   // highlights only
          gold:    '#f59e0b',   // stars / trust badges
          gray:    '#6b7280',   // body text
          white:   '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Source Sans Pro', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #001b33 0%, #1a5a8a 100%)',
        'cta-gradient':  'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
