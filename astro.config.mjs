// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';
import rehypeUrlCard from './src/plugins/rehype-url-card.mjs';
import remarkUrlCard from './src/plugins/remark-url-card.mjs';

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkUrlCard],
      rehypePlugins: [rehypeUrlCard],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});
