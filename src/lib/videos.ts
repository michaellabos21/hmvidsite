import { getCollection, type CollectionEntry } from 'astro:content';
import { env, industryBySlug, videoTypeBySlug } from '../data/site';

export type Video = CollectionEntry<'videos'>;

/** Published videos (plus drafts in dev / SHOW_DRAFTS builds), in display order. */
export async function getVideos(): Promise<Video[]> {
  const all = await getCollection('videos', (v) => env.showDrafts || !v.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Whether the client is named publicly. The schema guarantees approvalOnFile for
 * published videos with showClient, so only drafts can be named without approval.
 */
export const clientIsPublic = (v: Video) => v.data.showClient;

/** Public client name: the client if named, else the anonymized label. */
export const clientName = (v: Video) => (clientIsPublic(v) ? v.data.client : v.data.anonLabel || v.data.client);

export const videoUrl = (v: Video) => `/videos/${v.id}/`;

export const typeName = (v: Video) => videoTypeBySlug(v.data.type)?.name ?? v.data.type;

export const industryName = (v: Video) => industryBySlug(v.data.industry)?.name ?? v.data.industry;

/** Default alt text: "[Client] [type] video by Hughes Media". */
export const thumbAlt = (v: Video) => v.data.thumbnailAlt || `${clientName(v)} ${typeName(v).toLowerCase()} video by Hughes Media`;

/** Provider + ID for a YouTube or Vimeo URL. */
export function parseVideo(url: string): { provider: 'youtube' | 'vimeo'; id: string } | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { provider: 'youtube', id: yt[1] };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { provider: 'vimeo', id: vimeo[1] };
  return null;
}

/** Privacy-friendly embed URL (autoplay because it loads on click), or null. */
export function embedUrl(url: string, autoplay = true): string | null {
  const p = parseVideo(url);
  if (!p) return null;
  const ap = autoplay ? '1' : '0';
  return p.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${p.id}?autoplay=${ap}&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${p.id}?autoplay=${ap}&dnt=1`;
}

/** YouTube's own thumbnail, used when no thumbnail image is supplied. */
export function remoteThumb(v: Video): string | null {
  const p = parseVideo(v.data.videoUrl);
  return p?.provider === 'youtube' ? `https://i.ytimg.com/vi/${p.id}/hqdefault.jpg` : null;
}

/** "1:30" → "PT1M30S" for VideoObject.duration. */
export function isoDuration(d: string): string {
  const parts = d.split(':').map(Number);
  const [h, m, s] = parts.length === 3 ? parts : [0, ...parts];
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || (!h && !m) ? `${s}S` : ''}`;
}

/** Homepage reel: the first video flagged reel, else the first featured video. */
export async function getReel(): Promise<Video | undefined> {
  const all = await getVideos();
  return all.find((v) => v.data.reel) ?? all.find((v) => v.data.featured);
}

/** Featured videos for the homepage, topped up with the newest when fewer than 3. */
export async function getFeatured(max = 6, exclude?: Video): Promise<Video[]> {
  const all = (await getVideos()).filter((v) => v.id !== exclude?.id);
  const featured = all.filter((v) => v.data.featured).slice(0, max);
  if (featured.length >= 3) return featured;
  return [...featured, ...all.filter((v) => !v.data.featured)].slice(0, Math.min(3, all.length));
}

/** Related videos: same type first, then same industry, then the rest. */
export async function getRelated(v: Video, max = 3): Promise<Video[]> {
  const others = (await getVideos()).filter((o) => o.id !== v.id);
  const score = (o: Video) => (o.data.type === v.data.type ? 2 : 0) + (o.data.industry === v.data.industry ? 1 : 0);
  return others.sort((a, b) => score(b) - score(a)).slice(0, max);
}
