# アバター画像を favicon に変更

## 実装

- `public/avatar.jpg` をトリミングせず、32×32 の PNG (`public/favicon.png`) に縮小した。
- 全ページの favicon 参照と日記カード用のサイト favicon を `/favicon.png` に統一した。
- 既存の `public/favicon.svg` と `public/favicon.ico` は互換資産として残した。

## 検証

- `file` と `sips` で `public/favicon.png` が 32×32 の PNG であることを確認する。
- favicon の SVG/ICO 参照が残っていないことを確認する。
- `pnpm build` が成功することを確認する。
