# sharp update

Astro 7.3.3 accepts sharp 0.35.5 through its existing `^0.35.4` range.
Miniflare 5.20260820.0-alpha pins sharp 0.35.2, so the workspace override
targets that Miniflare version and resolves its sharp dependency to 0.35.5.

Regenerated the lockfile with `pnpm update sharp --depth Infinity --lockfile-only`.
Both dependency paths resolve to sharp 0.35.5, which meets the two fixed-version
thresholds of 0.35.4 and 0.35.5. The platform packages resolve to sharp 0.35.5
and sharp-libvips 1.3.4. The three-day minimum release age required no new
exceptions.

## Verification

Used Node 24.13.0 and pnpm 11.22.0.

- `pnpm install --frozen-lockfile`
- `pnpm why sharp` and inspection of all sharp lockfile entries
- `pnpm format:check`
- `pnpm run lint`
- `pnpm run build`
- `pnpm run check`

All checks above passed. The build used the saved snapshot for one external
source that returned HTTP 503. The existing `@astrojs/tailwind` peer warnings
for Astro and Tailwind CSS were also present during resolution.
