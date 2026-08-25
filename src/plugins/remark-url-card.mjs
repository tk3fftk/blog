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

function isUrlOnlyParagraph(node) {
  if (node.type !== 'paragraph' || node.children?.length !== 1) {
    return false;
  }

  const [link] = node.children;
  if (
    link.type !== 'link' ||
    !isHttpUrl(link.url) ||
    link.children?.length !== 1
  ) {
    return false;
  }

  const [text] = link.children;
  return text.type === 'text' && text.value === link.url;
}

function replaceUrlParagraphs(node) {
  if (!Array.isArray(node.children)) {
    return;
  }

  node.children = node.children.map((child) => {
    if (isUrlOnlyParagraph(child)) {
      return {
        type: 'urlCard',
        data: {
          hName: 'url-card',
          hProperties: { url: child.children[0].url },
        },
      };
    }

    replaceUrlParagraphs(child);
    return child;
  });
}

export default function remarkUrlCard() {
  return (tree, file) => {
    if (isDiaryMarkdown(file)) {
      replaceUrlParagraphs(tree);
    }
  };
}
