# 日記本文のリスト・引用スタイル

## 実装内容

- Tailwind v4 の Preflight が `ul` / `ol` の `list-style` と `padding`、`blockquote` の `margin` と `border` をリセットするため、日記本文でリストのマーカー・インデントと引用の区別が表示されていなかった。
- `src/pages/diary/[...slug].astro` の `.diary-content` 配下に限定して、`ul` は `disc`、`ol` は `decimal`、入れ子の `ul` は `circle` とし、`padding-left: 1.5rem` を付与する。
- 入れ子リストの上余白は `0.25rem` に詰める。
- `blockquote` には上余白 `1.25rem`、左ボーダー（アクセント色）、`padding-left: 1rem`、`--color-base-text-lighter` の文字色を付与する。先頭子要素の `margin-top` は 0 にして余白の二重化を防ぐ。

## 検証

- `pnpm check`
- `pnpm lint`
- `pnpm build`
- `/diary/2026-09-24` で、通常リスト・入れ子リスト・番号付きリストのマーカーとインデント、引用の左ボーダーと文字色が表示されることを確認する。
