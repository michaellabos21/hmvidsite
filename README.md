# Hughes Media Video Site

The Hughes Media video site, built with [Astro](https://astro.build) as a static site. It uses the hughesmedia.us brand theme: the colors and Bitter / Roboto / Oswald fonts, and the HM logo.

```bash
npm install
npm run dev       # http://localhost:4321 (draft videos are shown)
npm run build     # type-check + static build into dist/
npm run preview   # serve dist/
```

## Pages

- **Home**: hero with the featured reel, featured videos, stats strip, "What We Make" video types, client logos (hidden until approved), testimonials, CTA.
- **Videos** (`/videos/`): library filtered by **Type** and **Industry**, with "Show more videos". Filtered views are linkable, e.g. `/videos/?type=commercial&industry=education`.
- **Video page** (`/videos/<slug>/`): click-to-play player, summary, the story behind the video, results, testimonial, details (client, type, industry, length, what we did), and related videos.
- **Services**: one block per video type, plus the Plan / Shoot / Edit / Launch process.
- **About**, **Contact** (discovery call form), **404**, **Sitemap**, **Privacy Policy**.

The player shows the thumbnail and loads YouTube or Vimeo only when someone presses play, which keeps pages fast. YouTube loads from the privacy-friendly `youtube-nocookie.com` domain; Vimeo uses `dnt=1`.

## Adding a video

1. Copy `src/content/videos/_template/` to `src/content/videos/<url-slug>/`. The folder name becomes `/videos/<url-slug>/`.
2. Fill in `index.md`. Every field is commented in the template. Write the optional story behind the video in Markdown below the `---`.
3. Add a `thumbnail.jpg`: 1920×1080, or 1080×1920 for vertical. It's optional for YouTube, which supplies its own thumbnail, but a custom frame looks better. The build compresses it to WebP.
4. Set `reel: true` on the video for the homepage hero and `featured: true` on up to 6 others.
5. Set `draft: false` and deploy.

The build **fails with a plain-English message** when a video breaks a content rule:

- a required field is missing;
- `showClient: true` without `approvalOnFile: true` (written client approval);
- an anonymized video has no `anonLabel`;
- a Vimeo (non-YouTube) video has no thumbnail.

Drafts appear in `npm run dev` and in builds with `SHOW_DRAFTS=1`, never in production. The four example videos are drafts with placeholder thumbnails and `XXXXXXXXXXX` video IDs.

## Where things live

| What | Where |
| --- | --- |
| Phone, address, links, video types, industries, homepage stats, logos, badges, form options | `src/data/site.ts` |
| Video content + schema | `src/content/videos/`, `src/content.config.ts` |
| Pages | `src/pages/` |
| Brand styles | `src/styles/main.css` |
| Player, filters, mobile menu, form, tracking events | `src/scripts/main.js` |

**Before launch, update `src/data/site.ts`:**

- Set `links.mainSiteVideo` and each video type's `mainSiteUrl` to the matching hughesmedia.us pages.
- Set `links.portfolio` to the portfolio site, if there is one.
- Replace the bracketed `[00+]` homepage stat with a verified number.

## Environment variables

Set these in the host's build settings (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production domain; used for canonical tags, Open Graph, and the sitemap. **Required for launch.** |
| `PUBLIC_LEAD_ENDPOINT` | Where the discovery call form POSTs. Use the same CRM/inbox as the main site (CRM webhook, HubSpot, Formspree…). Any 2xx response counts as success. |
| `PUBLIC_GTM_ID` | Google Tag Manager container. |
| `PUBLIC_NOINDEX=1` | Staging: `noindex` on every page and `robots.txt` disallows everything. |
| `SHOW_DRAFTS=1` | Include draft videos (preview deploys). |

## Tracking

These `dataLayer` events are ready to map to GA4 conversions in GTM:

- `hm_form_submit` (form submit)
- `hm_phone_click` (phone click)
- `hm_discovery_click` (any "Schedule Discovery Call" button)
- `hm_main_site_click` (outbound click to hughesmedia.us)
- `hm_outbound_click` (other outbound clicks)
- `hm_video_play` (a video starts playing)
- `hm_filter` (Videos filters)

Form submissions without JavaScript land on `/contact/thanks/`, which can also serve as a URL-based conversion.

To enable the cookie banner with Consent Mode v2 defaults, set `cookieBanner = true` in `src/data/site.ts`.

## SEO

- Unique title and meta description on every page; each video page uses its own title and summary.
- Organization schema on every page.
- **VideoObject** schema on every video page (name, description, thumbnail, upload date, duration, embed URL), so videos can appear in Google video results.
- `/sitemap-index.xml` is generated automatically, and `robots.txt` points to it.
- Clean URLs: `/videos/video-name/`.
- Filters are linkable: `/videos/?type=testimonial`. Use these from hughesmedia.us pages and the portfolio site.

## Hosting

The output is plain static files in `dist/`, so it can go on any host: the hughesmedia.us host, Netlify, Cloudflare Pages, and so on. Upload `dist/` or connect the repo with build command `npm run build` and output directory `dist`.
