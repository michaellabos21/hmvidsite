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
  team: 'https://hughesmedia.us/',
  reviews: 'https://hughesmedia.us/reviews/',
  /** HM video site. Empty hides the "video site" links. */
  videoSite: '',
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
 * Service taxonomy. `mainSiteUrl` is the matching hughesmedia.us service page;
 * empty falls back to the main site home page. Fill these in before launch.
 */
export const services = [
  { slug: 'seo', name: 'SEO', mainSiteUrl: '' },
  { slug: 'ppc', name: 'PPC / Google Ads', mainSiteUrl: '' },
  { slug: 'paid-social', name: 'Paid Social', mainSiteUrl: '' },
  { slug: 'web-design-development', name: 'Web Design & Development', mainSiteUrl: '' },
  { slug: 'video', name: 'Video', mainSiteUrl: '' },
  { slug: 'branding', name: 'Branding', mainSiteUrl: '' },
  { slug: 'email', name: 'Email', mainSiteUrl: '' },
  { slug: 'programmatic', name: 'Programmatic', mainSiteUrl: '' },
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

export type ServiceSlug = (typeof services)[number]['slug'];
export type IndustrySlug = (typeof industries)[number]['slug'];

export const serviceSlugs = services.map((s) => s.slug) as [ServiceSlug, ...ServiceSlug[]];
export const industrySlugs = industries.map((i) => i.slug) as [IndustrySlug, ...IndustrySlug[]];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
export const serviceMainUrl = (slug: string) => serviceBySlug(slug)?.mainSiteUrl || links.mainSite;

/** Homepage. Alternate headlines for team review: "Real clients. Real results. No guesswork." · "Proof, not promises." · "The work behind the leads." */
export const home = {
  headline: 'Work that moves the numbers.',
  /** Verified figures only. */
  stats: [
    { number: '2000', label: 'Year founded' },
    { number: '8 yrs', label: 'Average client relationship' },
    { number: '+64%', label: 'Enrollment leads for a private school, same ad spend' },
    { number: '+27%', label: 'Google Ads leads for a home comfort company' },
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
export const budgetRanges = ['Under $2,500', '$2,500–$5,000', '$5,000–$10,000', '$10,000–$25,000', '$25,000+'];

/** "What do you need help with?" options on the form. */
export const formServices = ['SEO', 'PPC', 'Website', 'Social', 'Video', 'Not sure yet'];

/** Show the cookie banner (enables Google Consent Mode defaults). */
export const cookieBanner = false;

export const env = {
  leadEndpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT || '',
  gtmId: (import.meta.env.PUBLIC_GTM_ID || '').trim().toUpperCase(),
  noindex: import.meta.env.PUBLIC_NOINDEX === '1',
  showDrafts: import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === '1',
};
