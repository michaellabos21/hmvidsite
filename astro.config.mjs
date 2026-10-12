// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production domain (Open Decision #1). Set SITE_URL in the host's build settings.
const site = process.env.SITE_URL || 'https://example.com';
if (!process.env.SITE_URL) {
  console.warn('[hm] SITE_URL is not set; canonical URLs and the sitemap will use https://example.com');
}

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/contact/thanks/'),
    }),
  ],
});
