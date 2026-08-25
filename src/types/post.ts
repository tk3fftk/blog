export type PostContentType = 'diary' | 'article' | 'slide';
export type ExternalContentType = Exclude<PostContentType, 'diary'>;
export type PostSourceType = 'external' | 'diary' | 'manual';
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
