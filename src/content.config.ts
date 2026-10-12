import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { industrySlugs, videoTypeSlugs } from './data/site';

/**
 * Videos. One folder per video: src/content/videos/<slug>/index.md with its
 * thumbnail alongside. Copy src/content/videos/_template/ to start a new one.
 * The Markdown body (optional) is the "About this video" story.
 *
 * Publishing rules are enforced at build time (the build fails with a clear message):
 *  - every required field is filled in;
 *  - a named client needs `approvalOnFile: true`;
 *  - an anonymized client needs `anonLabel`;
 *  - Vimeo and other non-YouTube videos need a `thumbnail`.
 * Drafts (`draft: true`) skip the client rules and are left out of production builds.
 */
const videos = defineCollection({
  loader: glob({ pattern: '[!_]*/index.md', base: './src/content/videos' }),
  schema: ({ image }) =>
    z
      .object({
        /** Video title as shown on the site, e.g. "Spring Open House Commercial". */
        title: z.string().min(1),
        /** Always filled in; shown publicly only when showClient is true. */
        client: z.string().min(1),
        showClient: z.boolean().default(false),
        /** Written client approval to name them and publish the video and any numbers. */
        approvalOnFile: z.boolean().default(false),
        /** e.g. "Boston-area home comfort company". Required when showClient is false. */
        anonLabel: z.string().optional(),
        /** 1–2 sentences: cards, page intro, meta description, VideoObject description. */
        summary: z.string().min(1).max(320),
        /** YouTube or Vimeo URL. */
        videoUrl: z.url(),
        /** Optional for YouTube (its thumbnail is used); required otherwise. */
        thumbnail: image().optional(),
        thumbnailAlt: z.string().optional(),
        /** Running time, e.g. "1:30" or "0:15". */
        duration: z.string().regex(/^(\d+:)?\d{1,2}:\d{2}$/, 'Use m:ss or h:mm:ss, e.g. "1:30"'),
        /** 9:16 short-form video. */
        vertical: z.boolean().default(false),
        type: z.enum(videoTypeSlugs),
        industry: z.enum(industrySlugs),
        /** What Hughes Media did, e.g. [Concept, Scripting, Production, Editing, Motion graphics]. */
        deliverables: z.array(z.string().min(1)).default([]),
        /** Optional results, up to 4. */
        stats: z.array(z.object({ number: z.string().min(1), label: z.string().min(1) })).max(4).default([]),
        statsFootnote: z.string().optional(),
        testimonial: z.object({ quote: z.string().min(1), name: z.string().optional() }).optional(),
        /** Full case study on the portfolio site, if there is one. */
        caseStudyUrl: z.url().optional(),
        /** Use as the homepage hero reel (the first one by order wins). */
        reel: z.boolean().default(false),
        featured: z.boolean().default(false),
        /** Sort order on /videos/ and the homepage (lower first), then newest. */
        order: z.number().default(100),
        /** Publish / release date; used for ordering and VideoObject uploadDate. */
        date: z.coerce.date(),
        draft: z.boolean().default(false),
      })
      .superRefine((v, ctx) => {
        if (!v.thumbnail && !/youtu\.?be/.test(v.videoUrl)) {
          ctx.addIssue({ code: 'custom', path: ['thumbnail'], message: 'Non-YouTube videos need a thumbnail image.' });
        }
        if (v.draft) return;
        if (v.showClient && !v.approvalOnFile) {
          ctx.addIssue({
            code: 'custom',
            path: ['approvalOnFile'],
            message: 'Client is named (showClient: true) but written approval is not on file. Set approvalOnFile: true once approved, or anonymize.',
          });
        }
        if (!v.showClient && !v.anonLabel) {
          ctx.addIssue({
            code: 'custom',
            path: ['anonLabel'],
            message: 'Anonymized video needs anonLabel (e.g. "Boston-area home comfort company").',
          });
        }
      }),
});

export const collections = { videos };
