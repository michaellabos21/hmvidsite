import { getCollection, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';
import { env, industryBySlug, serviceBySlug } from '../data/site';

export type Project = CollectionEntry<'projects'>;

/** Published projects (plus drafts in dev / SHOW_DRAFTS builds), in display order. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', (p) => env.showDrafts || !p.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Whether the client is named publicly. The schema guarantees approvalOnFile for
 * published projects with showClient, so only drafts can be named without approval.
 */
export const clientIsPublic = (p: Project) => p.data.showClient;

/** Public name: client name if approved, else the anonymized label. */
export const projectName = (p: Project) =>
  clientIsPublic(p) ? p.data.client : p.data.anonLabel || p.data.client;

export const projectUrl = (p: Project) => `/work/${p.id}/`;

export const serviceNames = (p: Project) => p.data.services.map((s) => serviceBySlug(s)?.name ?? s);

export const industryName = (p: Project) => industryBySlug(p.data.industry)?.name ?? p.data.industry;

/** Default alt text: "[Client] [project type] project by Hughes Media". */
export const heroAlt = (p: Project) =>
  p.data.heroAlt || `${projectName(p)} ${serviceNames(p)[0] ?? ''} project by Hughes Media`.replace(/\s+/g, ' ');

/** Render a Markdown field to HTML. Content is authored in this repo. */
export const md = (src: string) => marked.parse(src, { async: false }) as string;

/** Featured projects for the homepage, topped up with the newest when fewer than 3. */
export async function getFeatured(max = 6): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.data.featured).slice(0, max);
  if (featured.length >= 3) return featured;
  return [...featured, ...all.filter((p) => !p.data.featured)].slice(0, Math.min(3, all.length));
}

/** YouTube / Vimeo embed URL, or null. */
export function videoEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
