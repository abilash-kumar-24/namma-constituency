# Namma Constituency

A citizen-first governance transparency tool for Tamil Nadu, India.

**Live demo:** `npm run dev` → http://localhost:3000

---

## What it does

- **Search** your MLA by name, constituency, or district
- **View** public affidavit data: criminal cases, assets, liabilities, education
- **See** local area indicators: transport, air quality, vehicles, infrastructure
- **Understand** what the data means in plain language
- **Get guidance** on raising a civic issue with the right department

---

## Quick start

```bash
cd namma-constituency
npm install
npm run dev
# → http://localhost:3000

# Build for production
npm run build
npm start
```

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

No environment variables required. Fully static — no database, no backend.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                      # Home page with search hero
│   ├── search/
│   │   ├── page.tsx                  # Search page (Server Component)
│   │   └── SearchResults.tsx         # Filtered results list
│   ├── constituency/[id]/
│   │   └── page.tsx                  # Constituency detail (SSG)
│   ├── compare/
│   │   ├── page.tsx                  # Compare page (Server wrapper)
│   │   └── ComparePageClient.tsx     # Selector + ComparePanel (Client)
│   ├── about/
│   │   └── page.tsx                  # About & data sources
│   ├── layout.tsx                    # App shell with Header + Footer
│   └── not-found.tsx                 # 404 page
│
├── components/
│   ├── layout/       Header, Footer
│   ├── ui/           Badge, Card, SkeletonCard
│   ├── search/       SearchBar (autocomplete), RepresentativeCard
│   ├── constituency/ Overview, AffidavitSnapshot, AreaIndicators,
│   │                 CitizenInterpretation, PublicActionSection, ShareButton
│   └── compare/      ComparePanel (side-by-side table)
│
├── data/
│   ├── representatives.json   5 MLA records (affidavit-based)
│   ├── indicators.json        District indicators per constituency
│   └── issueGuidance.json     6 civic issue categories + guidance
│
├── lib/utils.ts               Formatting helpers, color maps
└── types/index.ts             TypeScript interfaces
```

---

## Replacing sample data with real data

### MLA / affidavit data
Download from [MyNeta Tamil Nadu 2021](https://www.myneta.info/tamilnadu2021/)
and transform to match the `Representative` interface in `src/types/index.ts`.

Key fields: criminal_cases, serious_criminal_cases, assets_raw (in lakhs),
liabilities_raw (in lakhs), education, profession, party_short.

### Local area indicators
Download CSVs from [tn.data.gov.in](https://tn.data.gov.in) and transform
to the `ConstituencyIndicator` interface. Key: constituency_id must match
the representative's id field.

### Issue guidance
Edit `src/data/issueGuidance.json` to update department names, portal links,
or resolution timelines as official contacts change.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| Next.js 15 App Router | Framework |
| React + TypeScript | UI |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Local JSON | Sample data (no database needed) |

---

## Next steps for a real MVP

1. Add all 234 constituencies from the full MyNeta CSV
2. Add Tamil language toggle with `next-intl`
3. Schedule a GitHub Action to sync updated affidavit CSV nightly
4. Source constituency-level (not just district-level) open data from TNOGD
5. Deep-link to CPGRAMS or TN grievance portals per issue category
6. Add district + party filters on the search page
7. Add shareable constituency image cards (OG image or html-to-image)
