import { defineCollection, z } from 'astro:content';
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

export const collections = {
  externalArticles,
};
