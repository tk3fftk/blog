import { createHash } from 'node:crypto';
import type { Loader } from 'astro/loaders';
import Parser from 'rss-parser';
import type { FeedConfig } from '../data/feeds';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'portfolio-blog-feed-aggregator/1.0',
    Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
  },
});

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'ref',
  'fbclid',
  'gclid',
]);

function normalizeUrl(rawUrl: string): string {
  try {
    const urlObj = new URL(rawUrl);
    for (const key of Array.from(urlObj.searchParams.keys())) {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        urlObj.searchParams.delete(key);
      }
    }
    return urlObj.toString();
  } catch {
    return rawUrl;
  }
}

function getFaviconUrl(rawUrl: string): string | undefined {
  try {
    const { origin } = new URL(rawUrl);
    return `https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(origin)}`;
  } catch {
    return undefined;
  }
}

function generateEntryId(url: string, platform: string): string {
  const hash = createHash('sha256')
    .update(`${platform}:${url}`)
    .digest('hex')
    .slice(0, 16);
  return `${platform}-${hash}`;
}

export function rssLoader({ feeds }: { feeds: FeedConfig[] }): Loader {
  return {
    name: 'rss-feed-loader',
    load: async ({ store, logger, parseData, generateDigest }) => {
      logger.info(
        `Fetching RSS feeds from ${feeds.length} source(s) for tk3fftk...`
      );

      // Fetch all configured feeds concurrently
      const feedResults = await Promise.allSettled(
        feeds.map(async (feed) => {
          try {
            const feedData = await parser.parseURL(feed.url);
            return {
              feed,
              items: feedData.items || [],
            };
          } catch (error) {
            logger.warn(
              `Failed to fetch feed for ${feed.name} (${feed.url}): ${error instanceof Error ? error.message : String(error)}`
            );
            return {
              feed,
              items: [],
            };
          }
        })
      );

      let totalItems = 0;

      for (const result of feedResults) {
        if (result.status === 'rejected') {
          continue;
        }

        const { feed, items } = result.value;

        for (const item of items) {
          if (!item.link || !item.title) {
            continue;
          }

          const normalizedUrl = normalizeUrl(item.link);
          const id = generateEntryId(normalizedUrl, feed.platform);
          const rawDate =
            item.isoDate || item.pubDate || new Date().toISOString();
          const pubDate = new Date(rawDate);

          const snippet = item.contentSnippet
            ? item.contentSnippet.replace(/\r?\n+/g, ' ').trim()
            : undefined;

          const rawData = {
            title: item.title.trim(),
            url: normalizedUrl,
            pubDate,
            contentSnippet: snippet ? snippet.slice(0, 200) : undefined,
            postType: 'external',
            contentType: feed.contentType,
            platform: feed.platform,
            sourceName: feed.name,
            sourceUrl: feed.sourceUrl,
            faviconUrl: getFaviconUrl(normalizedUrl),
          };

          const parsed = await parseData({
            id,
            data: rawData,
          });

          const digest = generateDigest(parsed);

          store.set({
            id,
            data: parsed,
            digest,
          });

          totalItems++;
        }
      }

      logger.info(
        `Successfully loaded ${totalItems} external post(s) into Content Layer.`
      );
    },
  };
}
