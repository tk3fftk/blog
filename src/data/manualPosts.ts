import type { ExternalContentType } from '../types/post';

/**
 * RSS を提供していない個別ページを追加するための設定です。
 * キーに URL、値に公開日（YYYY-MM-DD または ISO 8601）を指定してください。
 */
export const MANUAL_ARTICLE_URLS: Record<string, string> = {
  'https://sre-magazine.net/articles/5/tk3fftk/': '2024-10-01',
  'https://sre-magazine.net/articles/9/tk3fftk/': '2025-08-01',
  'https://lounge.primenumber.com/entry/n/n9538986c78a1': '2024-12-19',
  'https://findy-tools.io/products/new-relic/4/350': '2024-12-19',
  'https://cdcon2020.sched.com/event/dpvl/case-study-how-yahoo-japan-uses-and-contributes-to-screwdriver-at-scale-hiroki-takatsuka-jithin-emmanuel-yahoo-japan':
    '2020-10-07',
};

export interface ManualPostConfig {
  url: string;
  pubDate: string;
  contentType: ExternalContentType;
}

export const MANUAL_POSTS: ManualPostConfig[] = [
  ...Object.entries(MANUAL_ARTICLE_URLS).map(([url, pubDate]) => ({
    url,
    pubDate,
    contentType: 'article' as const,
  })),
];
