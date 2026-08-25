import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { FEED_SOURCES } from './data/feeds';
import { rssLoader } from './loaders/rssLoader';

const externalArticles = defineCollection({
  loader: rssLoader({ feeds: FEED_SOURCES }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    pubDate: z.coerce.date(),
    contentSnippet: z.string().optional(),
    postType: z.literal('external'),
    contentType: z.enum(['article', 'slide']),
    platform: z.enum(['zenn', 'note', 'qiita', 'speakerdeck', 'custom']),
    sourceName: z.string(),
    sourceUrl: z.string().optional(),
    faviconUrl: z.string().optional(),
  }),
});

const diary = defineCollection({
  loader: glob({
    base: './src/content/diary',
    pattern: '**/*.md',
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
  }),
});

export const collections = {
  externalArticles,
  diary,
};
