export type PostContentType = 'article' | 'slide';
export type PostSourceType = 'external' | 'blog' | 'manual';
export type PlatformType = 'zenn' | 'note' | 'qiita' | 'speakerdeck' | 'custom';

export interface UnifiedPost {
  id: string;
  title: string;
  url: string;
  pubDate: Date;
  contentSnippet?: string;
  postType: PostSourceType;
  contentType: PostContentType;
  platform: PlatformType;
  sourceName: string;
  sourceUrl?: string;
  faviconUrl?: string;
}
