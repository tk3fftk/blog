# Diary HMR 修正

## 問題

`astro dev` 中に `src/content/diary/*.md` を編集しても `/diary/[slug]` が更新されず、dev サーバーの再起動が必要だった。

## 原因

Astro 7.x + `@astrojs/cloudflare` の既知バグ。prerender 環境のページが content collection の HMR で invalidate されない。

- https://github.com/withastro/astro/issues/17335
- https://github.com/withastro/astro/issues/17991
- 修正: astro 7.3.3 (#18002)

## 対応

- `astro` 7.2.4 → 7.3.3
- `@astrojs/cloudflare` 14.2.3 → 14.3.2
- `@astrojs/markdown-remark` 7.2.4 → 7.3.1

`src/content.config.ts` の glob `base` は変更不要だった。

## 検証

1. `astro dev --background` で起動
2. `curl /diary/2026-09-24` → マーカー文字列なし
3. `src/content/diary/2026-09-24.md` にマーカー追記 → 再取得で反映
4. 追記を戻す → 再取得で消える
5. `pnpm build` / `pnpm check` 成功
