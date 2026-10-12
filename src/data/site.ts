/**
 * Site-wide settings. Business details must match hughesmedia.us exactly (NAP consistency).
 */

export const business = {
  name: 'Hughes Media Digital Agency',
  phone: '404.848.0487',
  phoneHref: 'tel:+14048480487',
  street: '280 Interstate North Circle SE, Suite 225',
  city: 'Atlanta',
  region: 'GA',
  postalCode: '30339',
  founded: '2000',
  directionsUrl:
    'https://www.google.com/maps/search/?api=1&query=280+Interstate+North+Circle+SE+Suite+225+Atlanta+GA+30339',
};

export const addressLine = `${business.street}, ${business.city}, ${business.region} ${business.postalCode}`;

export const links = {
  mainSite: 'https://hughesmedia.us/',
  /** hughesmedia.us video production service page. */
  mainSiteVideo: 'https://hughesmedia.us/',
  /** Hughes Media portfolio site (case studies). Empty hides the links. */
  portfolio: '',
  team: 'https://hughesmedia.us/',
  reviews: 'https://hughesmedia.us/reviews/',
  /** Booking link (e.g. Calendly). Empty sends "Schedule Discovery Call" buttons to /contact/. */
  discovery: '',
  social: {
    linkedin: '',
    facebook: '',
    instagram: '',
    youtube: '',
  },
};

export const discoveryUrl = links.discovery || '/contact/';

/**
 * Video types: the Type filter on /videos/ and the blocks on the Services page.
 * `mainSiteUrl` is the matching hughesmedia.us page; empty falls back to `links.mainSiteVideo`.
 */
export const videoTypes = [
  {
    slug: 'brand-film',
    name: 'Brand Films',
    desc: 'The story of who you are and why it matters, for your homepage, sales team, and recruiting.',
    mainSiteUrl: '',
  },
  {
    slug: 'commercial',
    name: 'Commercials & Ads',
    desc: 'TV, streaming, YouTube, and paid social spots built for the platform they run on.',
    mainSiteUrl: '',
  },
  {
    slug: 'testimonial',
    name: 'Testimonials & Case Studies',
    desc: 'Real customers explaining the results, in their own words.',
    mainSiteUrl: '',
  },
  {
    slug: 'short-form',
    name: 'Social & Short-Form',
    desc: 'Vertical and short edits for Reels, TikTok, Shorts, and ads, shot to be cut many ways.',
    mainSiteUrl: '',
  },
  {
    slug: 'event',
    name: 'Event Coverage',
    desc: 'Conferences, galas, and openings captured as highlight reels and social clips.',
    mainSiteUrl: '',
  },
  {
    slug: 'explainer',
    name: 'Explainers & Animation',
    desc: 'Motion graphics and animation that make a product or process easy to understand.',
    mainSiteUrl: '',
  },
] as const;

export const industries = [
  { slug: 'home-services', name: 'Home Services' },
  { slug: 'education', name: 'Education' },
  { slug: 'legal', name: 'Legal' },
  { slug: 'financial', name: 'Financial' },
  { slug: 'healthcare', name: 'Healthcare' },
  { slug: 'b2b', name: 'B2B' },
  { slug: 'hospitality-events', name: 'Hospitality & Events' },
  { slug: 'other', name: 'Other' },
] as const;

export type VideoTypeSlug = (typeof videoTypes)[number]['slug'];
export type IndustrySlug = (typeof industries)[number]['slug'];

export const videoTypeSlugs = videoTypes.map((t) => t.slug) as [VideoTypeSlug, ...VideoTypeSlug[]];
export const industrySlugs = industries.map((i) => i.slug) as [IndustrySlug, ...IndustrySlug[]];

export const videoTypeBySlug = (slug: string) => videoTypes.find((t) => t.slug === slug);
export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
export const videoTypeMainUrl = (slug: string) => videoTypeBySlug(slug)?.mainSiteUrl || links.mainSiteVideo;

/** Homepage. Alternate headlines for team review: "Watch the work." · "Video built around results." */
export const home = {
  headline: 'Video that does a job.',
  /** Verified figures only. Replace the bracketed placeholder before launch. */
  stats: [
    { number: '2000', label: 'Making marketing work since' },
    { number: '8 yrs', label: 'Average client relationship' },
    { number: '[00+]', label: '[Videos produced — verify]' },
    { number: 'ATL', label: 'In-house team in Atlanta' },
  ],
  /**
   * Client logos: only with written client approval. Files go in public/images/logos/.
   * Section is hidden while empty.
   */
  clientLogos: [] as { src: string; alt: string }[],
};

/** Footer badges (Google Partner, awards). Files go in public/images/badges/. */
export const badges = [] as { src: string; alt: string }[];

/** Kangaroo mark (404 page and footer). e.g. '/images/kangaroo.svg'. Empty hides it. */
export const kangarooMark = '';

/** Budget ranges on the discovery call form. */
export const budgetRanges = ['Under $5,000', '$5,000–$10,000', '$10,000–$25,000', '$25,000–$50,000', '$50,000+'];

/** "What kind of video?" options on the form. */
export const formServices = ['Brand film', 'Commercial / ad', 'Testimonials', 'Social / short-form', 'Event', 'Animation', 'Not sure yet'];

/** Show the cookie banner (enables Google Consent Mode defaults). */
export const cookieBanner = false;

export const env = {
  leadEndpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT || '',
  gtmId: (import.meta.env.PUBLIC_GTM_ID || '').trim().toUpperCase(),
  noindex: import.meta.env.PUBLIC_NOINDEX === '1',
  showDrafts: import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === '1',
};
