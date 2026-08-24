import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Loader } from 'astro/loaders';
import Parser from 'rss-parser';
import type { FeedConfig } from '../data/feeds';
import type { UnifiedPost } from '../types/post';

export interface RssLoaderOptions {
  feeds: FeedConfig[];
  snapshotFilePath?: string;
}

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

export function rssLoader(options: RssLoaderOptions): Loader {
  const { feeds, snapshotFilePath = 'src/data/posts-snapshot.json' } = options;

  return {
    name: 'rss-feed-loader',
    load: async ({ store, logger, parseData, generateDigest }) => {
      const snapshotPath = resolve(process.cwd(), snapshotFilePath);
      const postMap = new Map<string, UnifiedPost>();

      // 1. Load existing items from snapshot if available
      try {
        const rawSnapshot = await readFile(snapshotPath, 'utf-8');
        const snapshotItems = JSON.parse(rawSnapshot) as UnifiedPost[];
        for (const item of snapshotItems) {
          postMap.set(item.id, {
            ...item,
            pubDate: new Date(item.pubDate),
          });
        }
        logger.info(
          `Loaded ${postMap.size} existing post(s) from snapshot (${snapshotFilePath}).`
        );
      } catch {
        logger.info(
          `No existing snapshot found at ${snapshotFilePath}. A new snapshot will be initialized.`
        );
      }

      const initialCount = postMap.size;

      // 2. Fetch all configured live feeds concurrently
      logger.info(
        `Fetching live RSS feeds from ${feeds.length} source(s) for tk3fftk...`
      );

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

      let fetchedNewOrUpdatedCount = 0;

      // 3. Merge live feed items into postMap
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

          const postData: UnifiedPost = {
            id,
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

          const existing = postMap.get(id);
          if (!existing) {
            postMap.set(id, postData);
            fetchedNewOrUpdatedCount++;
          } else {
            // Update title or snippet if changed
            if (
              existing.title !== postData.title ||
              existing.contentSnippet !== postData.contentSnippet
            ) {
              postMap.set(id, { ...existing, ...postData });
              fetchedNewOrUpdatedCount++;
            }
          }
        }
      }

      const allPosts = Array.from(postMap.values()).sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      // 4. Save updated snapshot if new items or updates occurred, or snapshot did not exist
      if (fetchedNewOrUpdatedCount > 0 || initialCount === 0) {
        try {
          await mkdir(dirname(snapshotPath), { recursive: true });
          const serializedSnapshot = JSON.stringify(allPosts, null, 2) + '\n';
          await writeFile(snapshotPath, serializedSnapshot, 'utf-8');
          logger.info(
            `Saved ${allPosts.length} post(s) to snapshot (${snapshotFilePath}).`
          );
        } catch (err) {
          logger.warn(
            `Failed to save snapshot file at ${snapshotPath}: ${err instanceof Error ? err.message : String(err)}`
          );
        }
      }

      // 5. Store all merged posts in Astro Content Layer Data Store
      for (const post of allPosts) {
        const parsed = await parseData({
          id: post.id,
          data: post as unknown as Record<string, unknown>,
        });

        const digest = generateDigest(parsed);

        store.set({
          id: post.id,
          data: parsed,
          digest,
        });
      }

      logger.info(
        `Successfully loaded ${allPosts.length} total external post(s) (Live + Snapshot) into Content Layer.`
      );
    },
  };
}
