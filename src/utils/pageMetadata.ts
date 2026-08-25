const REQUEST_TIMEOUT_MS = 5000;
const TEXT_MAX_LENGTH = 200;

export interface PageMetadata {
  title?: string;
  description?: string;
  publishedTime?: Date;
}

function decodeHtml(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function normalizeText(value: string): string {
  return decodeHtml(value.replace(/\s+/g, ' ').trim());
}

function truncate(value: string): string {
  return value.length > TEXT_MAX_LENGTH
    ? `${value.slice(0, TEXT_MAX_LENGTH - 1)}…`
    : value;
}

function getAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const attributePattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of tag.matchAll(attributePattern)) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    attributes[name.toLowerCase()] =
      doubleQuoted ?? singleQuoted ?? unquoted ?? '';
  }

  return attributes;
}

function findPublishedTime(metadata: Map<string, string>): Date | undefined {
  const rawDate = [
    'article:published_time',
    'og:published_time',
    'datepublished',
    'date',
    'dc.date',
  ]
    .map((key) => metadata.get(key))
    .find(Boolean);

  if (!rawDate) return undefined;

  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function getPageMetadata(html: string): PageMetadata {
  const metadata = new Map<string, string>();
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const attributes = getAttributes(tag);
    const key = (attributes.property || attributes.name || '').toLowerCase();
    const content = attributes.content;

    if (key && content && !metadata.has(key)) {
      metadata.set(key, normalizeText(content));
    }
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title =
    metadata.get('og:title') ||
    metadata.get('twitter:title') ||
    (titleMatch ? normalizeText(titleMatch[1].replace(/<[^>]*>/g, '')) : '');
  const description =
    metadata.get('og:description') || metadata.get('twitter:description');

  return {
    title: title ? truncate(title) : undefined,
    description: description ? truncate(description) : undefined,
    publishedTime: findPublishedTime(metadata),
  };
}

export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'portfolio-blog-manual-post/1.0',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Received HTTP ${response.status}`);
  }

  if (!response.headers.get('content-type')?.includes('text/html')) {
    throw new Error('Response was not HTML');
  }

  return getPageMetadata(await response.text());
}
