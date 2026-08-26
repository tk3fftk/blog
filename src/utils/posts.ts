import type { CollectionEntry } from 'astro:content';
import type { UnifiedPost } from '../types/post';

type ExternalArticle = CollectionEntry<'externalArticles'>;
type DiaryEntry = CollectionEntry<'diary'>;

function toDiaryPost({ id, data }: DiaryEntry): UnifiedPost {
  return {
    id: `diary-${id}`,
    title: data.title,
    url: `/diary/${id}`,
    pubDate: data.pubDate,
    contentSnippet: data.description,
    postType: 'diary',
    contentType: 'diary',
    platform: 'custom',
    sourceName: 'diary',
    faviconUrl: '/favicon.png',
  };
}

export function createUnifiedPosts(
  externalArticles: ExternalArticle[],
  diaryEntries: DiaryEntry[]
): UnifiedPost[] {
  return [
    ...externalArticles.map(({ id, data }) => ({ id, ...data })),
    ...diaryEntries.map(toDiaryPost),
  ].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
