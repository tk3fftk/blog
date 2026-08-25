const REQUEST_TIMEOUT_MS = 5000;
const TEXT_MAX_LENGTH = 200;

function isDiaryMarkdown(file) {
  const paths = [file.path, ...(file.history ?? [])].filter(
    (path) => typeof path === 'string'
  );

  return paths.some((path) =>
    path.replaceAll('\\', '/').includes('/src/content/diary/')
  );
}

function isHttpUrl(value) {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function normalizeText(value) {
  return decodeHtml(value.replace(/\s+/g, ' ').trim());
}

function truncate(value) {
  return value.length > TEXT_MAX_LENGTH
    ? `${value.slice(0, TEXT_MAX_LENGTH - 1)}…`
    : value;
}

function getAttributes(tag) {
  const attributes = {};
  const attributePattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of tag.matchAll(attributePattern)) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    attributes[name.toLowerCase()] =
      doubleQuoted ?? singleQuoted ?? unquoted ?? '';
  }

  return attributes;
}

function getMetadata(html, baseUrl) {
  const metadata = new Map();
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
    metadata.get('og:description') || metadata.get('twitter:description') || '';
  const rawImage = metadata.get('og:image') || metadata.get('twitter:image');

  let image;
  if (rawImage) {
    try {
      const resolvedImage = new URL(rawImage, baseUrl).toString();
      if (isHttpUrl(resolvedImage)) {
        image = resolvedImage;
      }
    } catch {
      // Ignore invalid OGP image URLs and render the text-only card.
    }
  }

  return {
    title: title ? truncate(title) : undefined,
    description: description ? truncate(description) : undefined,
    image,
  };
}

async function fetchMetadata(url) {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'portfolio-blog-url-card/1.0',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (
      !response.ok ||
      !response.headers.get('content-type')?.includes('text/html')
    ) {
      return {};
    }

    return getMetadata(await response.text(), response.url);
  } catch {
    return {};
  }
}

function element(tagName, properties, children) {
  return { type: 'element', tagName, properties, children };
}

function text(value) {
  return { type: 'text', value };
}

function createCard(url, metadata) {
  const hostname = new URL(url).hostname;
  const title = metadata.title || hostname;
  const children = [];

  if (metadata.image) {
    children.push(
      element('span', { className: ['url-card__image'] }, [
        element(
          'img',
          {
            src: metadata.image,
            alt: '',
            loading: 'lazy',
            decoding: 'async',
          },
          []
        ),
      ])
    );
  }

  const bodyChildren = [
    element('span', { className: ['url-card__title'] }, [text(title)]),
  ];

  if (metadata.description) {
    bodyChildren.push(
      element('span', { className: ['url-card__description'] }, [
        text(metadata.description),
      ])
    );
  }

  bodyChildren.push(
    element('span', { className: ['url-card__meta'] }, [
      text(`${hostname} · ${url}`),
    ])
  );

  children.push(
    element('span', { className: ['url-card__body'] }, bodyChildren)
  );

  return element(
    'a',
    {
      className: ['url-card'],
      href: url,
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    },
    children
  );
}

async function replaceUrlCards(node) {
  if (!Array.isArray(node.children)) {
    return;
  }

  for (let index = 0; index < node.children.length; index++) {
    const child = node.children[index];

    if (child.type === 'element' && child.tagName === 'url-card') {
      const url = child.properties?.url;
      if (typeof url === 'string' && isHttpUrl(url)) {
        node.children[index] = createCard(url, await fetchMetadata(url));
      }
      continue;
    }

    await replaceUrlCards(child);
  }
}

export default function rehypeUrlCard() {
  return async (tree, file) => {
    if (isDiaryMarkdown(file)) {
      await replaceUrlCards(tree);
    }
  };
}
