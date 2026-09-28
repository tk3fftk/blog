# diary の OGP メタデータ

## 実装

- diary 個別ページに Open Graph と X Card のタイトル、説明文、画像を追加する。
- タイトルと説明文は各 diary エントリから取得し、画像は既存の `public/avatar.jpg` を使う。
- SNS クローラー向けに `og:url` と画像 URL を絶対 URL にする。
- Astro の `site` を現在の公開先 `https://blog.tk3fftk.workers.dev` に設定し、SNSへ共有するURLとOGP画像のホストを一致させる。
- Xカードを `summary_large_image` にし、画像を大きく表示する。

## 検証

- diary ページの HTML に OGP と X Card の各メタタグが出力されることを確認する。
- タイトルと説明文が記事データに一致し、ページ URL と画像 URL が `https://blog.tk3fftk.workers.dev` で始まることを確認する。
- Xカード種別が `summary_large_image` で出力されることを確認する。
- `pnpm build` が成功することを確認する。
