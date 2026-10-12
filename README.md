# Hughes Media Portfolio

Standalone portfolio site for Hughes Media Digital Agency, built with [Astro](https://astro.build) as a static site. It uses the hughesmedia.us brand theme: the colors and fonts below and the HM logo.

```bash
npm install
npm run dev       # http://localhost:4321 (draft projects are shown)
npm run build     # type-check + static build into dist/
npm run preview   # serve dist/
```

## Adding a project (about 30 minutes)

1. Copy `src/content/projects/_template/` to `src/content/projects/<url-slug>/`. The folder name becomes `/work/<url-slug>/`.
2. Replace `hero.jpg` and fill in `index.md`. Every field is commented in the template.
3. Add gallery images to the same folder if you have them. The build converts all images to compressed WebP.
4. Set `draft: false` and deploy.

The build **fails with a plain-English message** when a project breaks a content rule:

- a required field is missing, or there are no stats (every project needs at least one measurable result);
- `showClient: true` without `approvalOnFile: true` (written client approval);
- an anonymized project has no `anonLabel`.

Drafts appear in `npm run dev` and in builds with `SHOW_DRAFTS=1`, never in production.

## Where things live

| What | Where |
| --- | --- |
| Phone, address, links, service/industry lists, homepage stats, logos, badges, budget ranges | `src/data/site.ts` |
| Project content + schema | `src/content/projects/`, `src/content.config.ts` |
| Pages (Home, Work, Project, Services, About, Contact, 404, Sitemap, Privacy) | `src/pages/` |
| Brand styles (color tokens, Bitter / Roboto / Oswald) | `src/styles/main.css` |
| Filters, mobile menu, gallery, form, tracking events | `src/scripts/main.js` |

**Before launch, fill in each service's `mainSiteUrl` in `src/data/site.ts`.** These are the hughesmedia.us service pages that "Learn about our … services →" links point to. Empty ones fall back to the main site's home page.

## Environment variables

Set these in the host's build settings (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production domain; used for canonical tags, Open Graph, and the sitemap. **Required for launch.** |
| `PUBLIC_LEAD_ENDPOINT` | Where the discovery call form POSTs. Use the same CRM/inbox as the main site (CRM webhook, HubSpot, Formspree…). Any 2xx response counts as success. |
| `PUBLIC_GTM_ID` | Google Tag Manager container. |
| `PUBLIC_NOINDEX=1` | Staging: `noindex` on every page and `robots.txt` disallows everything. |
| `SHOW_DRAFTS=1` | Include draft projects (preview deploys). |

## Tracking

These `dataLayer` events are ready to map to GA4 conversions in GTM:

- `hm_form_submit` (form submit)
- `hm_phone_click` (phone click)
- `hm_discovery_click` (any "Schedule Discovery Call" button)
- `hm_main_site_click` (outbound click to hughesmedia.us)
- `hm_outbound_click` (other outbound clicks)
- `hm_filter` (Work filters)

Form submissions without JavaScript land on `/contact/thanks/`, which can also serve as a URL-based conversion.

To enable the cookie banner with Consent Mode v2 defaults, set `cookieBanner = true` in `src/data/site.ts`.

## SEO

- Title and meta templates follow the build plan.
- Organization schema on every page; CreativeWork schema on project pages.
- `/sitemap-index.xml` is generated automatically, and `robots.txt` points to it.
- Clean URLs: `/work/project-name/`.
- A project with `canonicalUrl` points its canonical tag at the main-site case study.
- Work filters are linkable: `/work/?service=seo&industry=legal`. Use these from hughesmedia.us service pages.

## Hosting

The output is plain static files in `dist/`, so it can go on any host: the hughesmedia.us host, Netlify, Cloudflare Pages, and so on. Upload `dist/` or connect the repo with build command `npm run build` and output directory `dist`.
