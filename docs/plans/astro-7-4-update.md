# Astro 7.4 dependency update

## Implementation

- Raise the Astro dependency floor from `^7.3.3` to `^7.4.7`. pnpm resolves Astro to 7.4.12.
- Raise `@astrojs/markdown-remark` from `^7.3.1` to `^7.3.7` and resolve it to 7.3.9 so the Markdown processor shares Astro 7.4.12's internal helper types.
- Keep `@astrojs/cloudflare` at 14.3.2. Its `astro` peer range is `^7.2.0`, which includes 7.4.12.
- Regenerate `pnpm-lock.yaml` with pnpm 11 using the existing three-day `minimumReleaseAge` policy. This update requires no new exemptions.
- Consult the [Astro upgrade guide](https://docs.astro.build/en/upgrade-astro/) and the [Cloudflare adapter guide](https://docs.astro.build/en/guides/integrations-guide/cloudflare/).

## Verification

All five CI checks passed locally with Node.js 24.13.0 and pnpm 11.22.0.

1. `pnpm install --frozen-lockfile`
2. `pnpm format:check`
3. `pnpm run lint`
4. `pnpm run build`
5. `pnpm run check`

The optional strict peer check flags the existing `@astrojs/tailwind@6.0.2` peer ranges for Astro and Tailwind CSS. The site configures Tailwind using `@tailwindcss/vite`.

The Cloudflare build generated seven pages. One external content request returned HTTP 503 and used the stored snapshot. Build-generated snapshot updates were excluded from the commit.
