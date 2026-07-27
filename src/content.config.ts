import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    /**
     * Set for work published somewhere else. The listing then links straight
     * out and no page is generated for it, so the body is never rendered.
     */
    external: z.url().optional(),
    /** Shown next to the date, e.g. "TU Delft Repository". */
    source: z.string().optional(),
  }),
});

export const collections = { writing };
