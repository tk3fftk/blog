# Diary Markdown 投稿機能

## Summary

リポジトリにコミットしたMarkdownを `diary` 投稿として公開する。外部RSS記事とトップページで統合表示し、各投稿の詳細は `/diary/[...slug]` で静的生成する。

## Implementation Changes

- `src/content/diary/` をローカルMarkdown投稿ディレクトリとして、Astro Content Collectionの `glob()` ローダーで読み込む。
  - 必須フロントマターは `title`、`pubDate`、`description`。
  - `diary` はコレクションで固定し、投稿ファイルごとの種別指定は不要。
- 投稿種別を `diary | article | slide` とし、日記と外部RSS記事を共通表示用データへ正規化して公開日降順に統合する。
- トップページのカードは既存のfavicon・参照元表示を継承する。
  - 日記はサイトfaviconと `diary` を参照元として表示する。
  - 種別バッジは表示しない。
  - 日記・外部記事ともに別タブで開く。
- `src/pages/diary/[...slug].astro` で各Markdownの静的詳細ページを生成し、タイトル、公開日、説明、Markdown本文を表示する。

## Verification

- `npm run lint`
- `npm run check`
- `npm run build`
- `/diary/first-diary/` とトップページが生成されることを確認する。

## Assumptions

- 日記の一覧専用ページは設けず、トップページと個別詳細ページを提供する。
- 既存RSSの取得・スナップショット仕様は変更しない。
