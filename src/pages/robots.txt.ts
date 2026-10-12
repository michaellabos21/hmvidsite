import type { APIRoute } from 'astro';

// Staging builds (PUBLIC_NOINDEX=1) block all crawlers.
export const GET: APIRoute = ({ site }) => {
  const blocked = import.meta.env.PUBLIC_NOINDEX === '1';
  const body = blocked
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
