import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { diaryFeed } from '../../config/site';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const entries = await getCollection('diary');

  return rss({
    title: diaryFeed.title,
    description: '',
    site: site!,
    trailingSlash: false,
    customData: '<language>ja</language>',
    items: entries
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
      .map(({ id, data }) => ({
        title: data.title,
        pubDate: data.pubDate,
        description: data.description,
        link: new URL(`/diary/${id}`, site).href,
      })),
  });
};
