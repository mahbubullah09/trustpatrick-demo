# TrustPatrick — SEO Architecture & Why It Wins

## Overview

TrustPatrick generates **thousands of hyper-targeted, city-level service pages** at build time using static data baked directly into the codebase. This is fundamentally different from sites that fetch location or service data from an API at runtime — and the difference has a massive impact on SEO, speed, and crawlability.

---

## How the Pages Are Built

### URL Structure

Every money page follows this pattern:

```
/[state]/[city]/[service-slug]

Examples:
  /co/denver/asphalt-paving-companies
  /tx/houston/concrete-companies
  /ca/los-angeles/gravel-driveway-contractors
```

There are three layers of dynamic routing, each driven entirely by static data:

| Layer | Example | Source |
|---|---|---|
| State/Region | `/co` | `src/data/locations.ts` |
| City | `/co/denver` | `src/data/locations.ts` |
| Service | `/co/denver/asphalt-paving-companies` | `src/data/services.ts` |

### Scale

- ~1,927 cities across all US states
- 3 services per city
- **~5,781 service pages** generated at build time
- Plus ~1,927 city landing pages and ~50 state pages
- Plus every contractor profile (`/pros/[slug]`)

All of these pages exist as **pre-rendered HTML** before any user ever visits the site.

---

## Why Static Data in the Codebase Beats API-Driven Location Data

### The Alternative (What Most Sites Do)

Many directory sites fetch their location list from a database or API at request time:

```
User visits /denver/asphalt  →  Server hits DB to get "Denver" data  →  Renders page  →  Sends HTML
```

This creates several SEO problems:

1. **Pages only exist when someone visits them** — Googlebot may or may not crawl them
2. **Slow TTFB (Time to First Byte)** — database latency adds 100–500ms before any HTML is sent
3. **No build-time HTML** — server-rendered pages cannot be pre-cached at the CDN edge
4. **`generateStaticParams` is impossible** — Next.js cannot pre-build routes it doesn't know about at compile time
5. **Metadata (title, description, OG tags) is generated late** — crawlers sometimes miss dynamically injected meta tags

### The TrustPatrick Approach

Location and service data lives in `src/data/locations.ts` and `src/data/services.ts` — plain TypeScript files compiled into the app bundle.

```typescript
// generateStaticParams in /app/[region]/[city]/[service]/page.tsx
export async function generateStaticParams() {
  const params = [];
  for (const region of getAllRegions()) {
    for (const city of getCitiesInRegion(region.region_code)) {
      for (const service of services) {
        params.push({
          region: region.region_code.toLowerCase(),
          city: slugify(city.city_name),
          service: service.slug,
        });
      }
    }
  }
  return params;
}
```

At build time, Next.js calls this function and **pre-renders all 5,781+ pages to static HTML**. The result:

| Factor | API-driven location | TrustPatrick (static data) |
|---|---|---|
| Page exists before visit | ❌ No | ✅ Yes |
| TTFB | ~300–600ms | ~20–50ms (CDN edge) |
| Googlebot can crawl | Uncertain | Guaranteed |
| Metadata at build time | ❌ No | ✅ Yes |
| Works without a database | ❌ No | ✅ Yes |
| Can be pre-cached on CDN | ❌ No | ✅ Yes |

---

## What Still Comes From the API (and Why That's Fine)

Not everything is static. Live contractor data, project history, and reviews come from the API at request time — but with a key difference: **5-minute ISR caching**.

```typescript
const res = await fetch(url, {
  next: { revalidate: 300 }, // 5-minute cache
});
```

This means:
- The **page shell (HTML, meta tags, headings, content)** is always pre-built and served instantly from the CDN
- The **live contractor listings** are fetched server-side and cached for 5 minutes
- Googlebot sees a fully rendered page with real content on every visit
- Users never wait for a loading spinner — the page loads fast and content is already there

| Data | Source | When |
|---|---|---|
| City name, state, zip codes | `locations.ts` (codebase) | Build time |
| Service name, descriptions, H1 templates | `services.ts` (codebase) | Build time |
| Page title, meta description, canonical URL | Generated from templates | Build time |
| Featured contractors | API (`/featured_experts`) | Request time, cached 5 min |
| Nearby projects | API (`/projects_by_location`) | Request time, cached 5 min |
| Contractor profiles | API (`/company_by_slug`) | Request time, cached 5 min |

---

## SEO Benefits in Practice

### 1. Unique, Keyword-Rich Pages at Scale

Each page has a unique H1, title tag, and meta description filled with the exact city and service name:

```
Title:    "Asphalt Paving Companies in Denver, CO — TrustPatrick"
H1:       "Best Asphalt Paving Contractors in Denver, CO"
Meta:     "Find vetted asphalt paving companies in Denver. Compare ratings, licenses, and get free quotes."
Canonical: https://trustpatrick.com/co/denver/asphalt-paving-companies
```

This targets long-tail search queries like:
- *"asphalt paving companies in Denver"*
- *"concrete contractors Highlands Ranch CO"*
- *"gravel driveway contractors near me [city]"*

These are high-intent, low-competition keywords — a user searching this is ready to hire.

### 2. Googlebot Crawls Real HTML

When Googlebot visits any TrustPatrick page, it receives **complete, pre-rendered HTML** with all the content already in the document. There is no JavaScript hydration needed for the core content. This means:

- Meta tags are indexable immediately
- Heading structure (`H1`, `H2`) is in the raw HTML
- Internal links between city and service pages are in the HTML
- No risk of Googlebot timing out before JavaScript executes

### 3. Core Web Vitals — Fast Pages Rank Higher

Google uses Core Web Vitals (LCP, FID, CLS) as a ranking signal. Pre-built static pages served from Vercel's CDN edge score significantly better than server-rendered pages that hit a database on every request:

- **LCP (Largest Contentful Paint)**: Static HTML loads the main content instantly — no waiting for API calls
- **TTFB (Time to First Byte)**: CDN edge delivery gives sub-50ms TTFB vs 300–600ms for database-driven pages
- **No layout shift (CLS)**: Content is in the HTML, not injected by JavaScript after load

### 4. Internal Linking Structure

Every service page links to:
- Nearby cities offering the same service
- Other services in the same city
- Individual contractor profiles

This creates a dense internal link graph that distributes PageRank across all pages and helps Googlebot discover every URL efficiently.

---

## How the Sitemap Is Generated

### The Script

`scripts/generate-sitemap.ts` runs via `npm run sitemap` and produces `public/sitemap.xml`. It:

1. Iterates all regions → cities → services (same logic as `generateStaticParams`)
2. Adds every contractor profile from `src/data/companies.json`
3. Assigns each URL a **priority** and **changefreq** based on page type
4. Sets **`lastmod`** from the actual git commit date of the source file — not today's date

```typescript
// lastmod comes from git history, not the current date
const locationsDate = gitDate('src/data/locations.ts');  // e.g. "2026-04-01"
const servicesDate  = gitDate('src/data/services.ts');
```

### Priority Hierarchy

| Page type | Priority | Changefreq | Why |
|---|---|---|---|
| Homepage | `1.0` | weekly | Highest authority |
| Find contractors | `0.8` | weekly | High-intent landing page |
| Service pages (`/co/denver/asphalt`) | `0.8` | monthly | Money pages — most valuable |
| City pages (`/co/denver`) | `0.6` | monthly | Hub pages |
| Contractor profiles (`/pros/slug`) | `0.7` | monthly | Individual business pages |
| State pages (`/co`) | `0.5` | monthly | Broad, lower intent |

### Why `lastmod` From Git History Matters

Most auto-generated sitemaps set `lastmod` to today's date on every regeneration. Google has stated it ignores `lastmod` when the date changes too frequently or doesn't reflect real content changes.

TrustPatrick reads the actual last git commit date for each source file:

```typescript
function gitDate(filePath: string): string {
  const result = execSync(`git log -1 --format="%ci" ${filePath}`);
  return result.split(' ')[0]; // "2026-04-01"
}
```

This means `lastmod` only changes when `locations.ts`, `services.ts`, or `companies.json` actually change — making the signal trustworthy to Google and improving crawl budget allocation.

### XSL Stylesheet

The sitemap includes a custom XSL stylesheet (`/sitemap.xsl`) so it renders as a readable, styled HTML table when opened in a browser. This is useful for QA and makes the sitemap look professional if manually inspected.

---

## Summary: Why This Architecture Is Built for SEO

| SEO Factor | Impact |
|---|---|
| ~5,781 pre-built pages at deploy | Googlebot can crawl every page immediately, no lazy generation |
| Static data in codebase | `generateStaticParams` can enumerate all URLs — no API needed at build time |
| Build-time metadata | Title, description, canonical tags are in raw HTML — not injected by JS |
| CDN edge delivery | Sub-50ms TTFB improves Core Web Vitals which are a Google ranking signal |
| ISR for live data | Contractor listings stay fresh (5 min cache) without slowing page load |
| Unique content per page | Each city × service page has distinct H1, headings, and copy — not duplicate thin content |
| Honest sitemap `lastmod` | Google trusts the freshness signal, improves crawl budget efficiency |
| Dense internal linking | Every page links to nearby cities and related services — PageRank flows across the whole site |

The combination of **static location data in the codebase** + **`generateStaticParams`** + **ISR for live contractor data** + **a programmatically generated sitemap with real `lastmod` dates** is what separates TrustPatrick from directory sites that render pages on-demand from a database. Those sites are slower, harder for Googlebot to index reliably, and cannot guarantee every page exists before it is visited.
