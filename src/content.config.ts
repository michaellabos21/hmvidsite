import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { industrySlugs, serviceSlugs } from './data/site';

/**
 * Projects ("Work"). One folder per project: src/content/projects/<slug>/index.md
 * with its images alongside. Copy src/content/projects/_template/ to start a new one.
 *
 * Publishing rules are enforced at build time (the build fails with a clear message):
 *  - every required field is filled in;
 *  - a named client needs `approvalOnFile: true`;
 *  - an anonymized client needs `anonLabel`.
 * Drafts (`draft: true`) skip the client rules and are left out of production builds.
 */
const projects = defineCollection({
  loader: glob({ pattern: '[!_]*/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        /** Always filled in; shown publicly only when showClient + approvalOnFile. */
        client: z.string().min(1),
        showClient: z.boolean().default(false),
        /** Written client approval to name them, show their logo, or publish their numbers. */
        approvalOnFile: z.boolean().default(false),
        /** e.g. "Boston-area home comfort company". Required when showClient is false. */
        anonLabel: z.string().optional(),
        /** Plain-words outcome, used as "[Client]: [Outcome]". */
        outcome: z.string().min(1),
        /** 1–2 sentences: cards, hero, meta description. */
        summary: z.string().min(1).max(320),
        heroImage: image(),
        heroAlt: z.string().optional(),
        services: z.array(z.enum(serviceSlugs)).min(1),
        industry: z.enum(industrySlugs),
        /** Markdown. */
        challenge: z.string().min(1),
        approach: z.string().min(1),
        results: z.string().min(1),
        /** Up to 4. The first appears on the project card. */
        stats: z
          .array(z.object({ number: z.string().min(1), label: z.string().min(1) }))
          .min(1, 'Every project needs at least one measurable result.')
          .max(4),
        statsFootnote: z.string().optional(),
        gallery: z.array(z.object({ src: image(), alt: z.string().min(1) })).default([]),
        /** From the HM video site. YouTube/Vimeo embed; anything else shows a link. */
        videoUrl: z.url().optional(),
        testimonial: z.object({ quote: z.string().min(1), name: z.string().optional() }).optional(),
        /** Only shown when the client is named. */
        liveUrl: z.url().optional(),
        period: z.string().optional(),
        featured: z.boolean().default(false),
        /** Sort order on the Work page and homepage (lower first), then newest. */
        order: z.number().default(100),
        date: z.coerce.date(),
        /** If this duplicates a hughesmedia.us case study, the canonical tag points there. */
        canonicalUrl: z.url().optional(),
        draft: z.boolean().default(false),
      })
      .superRefine((p, ctx) => {
        if (p.draft) return;
        if (p.showClient && !p.approvalOnFile) {
          ctx.addIssue({
            code: 'custom',
            path: ['approvalOnFile'],
            message: 'Client is named (showClient: true) but written approval is not on file. Set approvalOnFile: true once approved, or anonymize.',
          });
        }
        if (!p.showClient && !p.anonLabel) {
          ctx.addIssue({
            code: 'custom',
            path: ['anonLabel'],
            message: 'Anonymized project needs anonLabel (e.g. "Boston-area home comfort company").',
          });
        }
      }),
});

export const collections = { projects };
