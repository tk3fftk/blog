# diary の OGP メタデータ

## 実装

- diary 個別ページに Open Graph と X Card のタイトル、説明文、画像を追加する。
- タイトルと説明文は各 diary エントリから取得し、画像は既存の `public/avatar.jpg` を使う。
- SNS クローラー向けに `og:url` と画像 URL を絶対 URL にする。
- Astro の `site` を `https://tk3fftk.dev` に設定し、サイトの公開 URL を絶対 URL の基準にする。

## 検証

- diary ページの HTML に OGP と X Card の各メタタグが出力されることを確認する。
- タイトルと説明文が記事データに一致し、ページ URL と画像 URL が `https://tk3fftk.dev` で始まることを確認する。
- `pnpm build` が成功することを確認する。
