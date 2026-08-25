import type { ExternalContentType, PlatformType } from '../types/post';

export interface FeedConfig {
  name: string;
  url: string;
  sourceUrl: string;
  platform: PlatformType;
  contentType: ExternalContentType;
}

export const FEED_SOURCES: FeedConfig[] = [
  {
    name: 'Zenn',
    url: 'https://zenn.dev/tk3fftk/feed',
    sourceUrl: 'https://zenn.dev/tk3fftk',
    platform: 'zenn',
    contentType: 'article',
  },
  {
    name: 'note',
    url: 'https://note.com/tk3fftk/rss',
    sourceUrl: 'https://note.com/tk3fftk',
    platform: 'note',
    contentType: 'article',
  },
  {
    name: 'Qiita',
    url: 'https://qiita.com/tk3fftk/feed',
    sourceUrl: 'https://qiita.com/tk3fftk',
    platform: 'qiita',
    contentType: 'article',
  },
  {
    name: 'Speaker Deck',
    url: 'https://speakerdeck.com/tk3fftk.rss',
    sourceUrl: 'https://speakerdeck.com/tk3fftk',
    platform: 'speakerdeck',
    contentType: 'slide',
  },
];
