# TrustPatrick — Next.js + Tailwind + Redux Toolkit

SEO-driven location × service directory site for driveway contractors.
**Domain:** trustpatrick.com

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (pre-renders all static pages)
npm start          # serve production build
```

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 15 (App Router)           |
| Styling     | Tailwind CSS                      |
| State       | Redux Toolkit + React-Redux       |
| Language    | TypeScript                        |
| Fonts       | Merriweather + Source Sans 3      |
| Deployment  | Vercel (recommended)              |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout — fonts, ReduxProvider, Header, Footer, Toasts
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Tailwind base + custom utilities
│   ├── sitemap.ts                    # Auto-generates /sitemap.xml
│   ├── robots.ts                     # /robots.txt
│   └── [region]/
│       ├── page.tsx                  # /ak → Alaska (all cities list)
│       └── [city]/
│           ├── page.tsx              # /ak/juneau → Juneau (service picker)
│           └── [service]/
│               └── page.tsx          # /ak/juneau/asphalt-paving-companies ← MONEY PAGE
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Redux: mobile menu + search drawer
│   │   └── Footer.tsx
│   ├── search/
│   │   ├── SearchWidget.tsx          # Redux: state/city/service dropdowns + recent searches
│   │   └── SearchHydrator.tsx        # Syncs URL params → Redux on landing page mount
│   ├── experts/
│   │   ├── ExpertsGrid.tsx           # Redux: async contractor fetch + skeletons + error state
│   │   └── ExpertCard.tsx            # Individual contractor card
│   ├── home/
│   │   ├── ServiceCards.tsx
│   │   └── TrustBadges.tsx
│   ├── service-templates/
│   │   ├── AsphaltTemplate.tsx       # Unique editorial for asphalt pages
│   │   └── ConcreteTemplate.tsx      # Unique editorial for concrete pages
│   └── ui/
│       └── ToastContainer.tsx        # Redux: global toast notifications
│
├── store/                            # ── Redux ──────────────────────────
│   ├── store.ts                      # configureStore — combines all slices
│   ├── hooks.ts                      # useAppDispatch / useAppSelector
│   ├── selectors.ts                  # All selector functions
│   ├── ReduxProvider.tsx             # 'use client' Provider wrapper
│   └── slices/
│       ├── searchSlice.ts            # Region/city/service + recent searches
│       ├── expertsSlice.ts           # Contractor API via createAsyncThunk
│       └── uiSlice.ts                # Mobile menu, modals, toasts, drawers
│
├── data/
│   ├── locations.ts                  # ← ADD YOUR 2042 CITIES HERE
│   └── services.ts                   # ← ADD MORE SERVICES HERE
│
└── lib/
    └── api.ts                        # fetchFeaturedExperts() — server-side fetch
```

---

## Redux Architecture

### Store Shape

```typescript
{
  search: {
    regionCode: string;       // "AK"
    regionName: string;       // "Alaska"
    citySlug: string;         // "juneau"
    cityName: string;         // "Juneau"
    serviceSlug: string;      // "asphalt-paving-companies"
    recentSearches: [...];    // last 5 searches
  },
  experts: {
    items: Expert[];          // up to 6 contractors
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    loadedKey: string | null; // cache key for current page
  },
  ui: {
    mobileMenuOpen: boolean;
    activeModal: string | null;
    toasts: Toast[];
    searchDrawerOpen: boolean;
    isPageLoading: boolean;
  }
}
```

### Data Flow — Landing Page

```
Server (RSC)
  └─ fetchFeaturedExperts(zipCodes, serviceCodes)  ← calls TrustPatrick API
       └─ passes initialExperts as prop to ExpertsGrid (client component)
            └─ on mount: dispatch(setExpertsFromServer({ experts, key }))
                 └─ Redux store hydrated — zero client network call for SSR visitors

Client navigation (SPA-style)
  └─ ExpertsGrid sees loadedKey !== cacheKey
       └─ dispatch(fetchExperts({ zipCodes, serviceCodes }))
            └─ async thunk → API call → store updated → grid re-renders
```

### Using Toasts Anywhere

```typescript
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/uiSlice';

const dispatch = useAppDispatch();
dispatch(addToast({ message: 'Estimate request sent!', type: 'success' }));
```

### Using the Search State

```typescript
import { useAppSelector } from '@/store/hooks';
import { selectRegionCode, selectCityName } from '@/store/selectors';

const regionCode = useAppSelector(selectRegionCode);
const cityName   = useAppSelector(selectCityName);
```

---

## Adding All 2042 Locations

Open `src/data/locations.ts` and add rows to the `RAW_DATA` string:

```
0,Denver,Colorado,CO,749000,80201;80202;80203;80204;80205
0,Colorado Springs,Colorado,CO,478961,80901;80902;80903
```

After adding locations, run `npm run build` — the site will pre-render every  
`/[region]/[city]/[service]` combination automatically.

---

## Adding More Services (currently 2 of 27)

1. Add entry to `src/data/services.ts`:

```typescript
{
  slug: 'paver-driveway-contractors',
  name: 'Paver Driveway Contractors',
  shortName: 'Pavers',
  description: 'Find trusted paver contractors near {city}, {region}.',
  h1Template: 'Paver Driveway Contractors Near {city}, {region}',
  introParagraph: '...',
  serviceCategoryCodes: ['745-1P-2'],
  ctaText: 'Get a Free Paver Estimate',
}
```

2. Create `src/components/service-templates/PaverTemplate.tsx`

3. Add it to the switch in `src/app/[region]/[city]/[service]/page.tsx`

---

## URL Structure

```
/                                          → Homepage
/ak                                        → Alaska (all cities)
/ak/juneau                                 → Juneau (service picker)
/ak/juneau/asphalt-paving-companies        → Asphalt landing page
/ak/juneau/concrete-driveway-contractors   → Concrete landing page
/sitemap.xml                               → Auto-generated sitemap
/robots.txt                                → Auto-generated robots.txt
```

---

## SEO & Google Indexing

Every `/[region]/[city]/[service]` page has:
- Unique `<title>` and `<meta description>` via `generateMetadata()`
- Canonical URL
- `priority: 0.9` in sitemap (highest — these are the money pages)
- Structured location data in content (zip codes, city, state)

**Day 1 checklist:**
1. Deploy to Vercel / your host
2. Go to [Google Search Console](https://search.google.com/search-console)
3. Add property for `trustpatrick.com`
4. Submit sitemap: `https://trustpatrick.com/sitemap.xml`

Scale at 2 services:   **6 × 2 = 12 pages** (with your 6 test cities)  
Scale at 2042 cities:  **2042 × 2 = 4,084 pages**  
Scale at 27 services:  **2042 × 27 = 55,134 pages**

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel          # follow prompts
```

Or connect your GitHub repo to Vercel — it auto-deploys on every push.
