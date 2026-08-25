# 手動 URL 投稿の集約

## Summary

RSS を提供しない外部記事・スライドを設定ファイルから追加し、既存の RSS 記事および日記と同じトップページの投稿一覧へ統合する。ページのタイトル・概要は HTML メタデータから取得し、公開日は設定で管理する。

## Implementation Changes

- `src/data/manualPosts.ts` に、記事とスライドそれぞれの `URL -> 公開日` マップを定義する。
  - 値には `YYYY-MM-DD` または ISO 8601 の公開日を指定する。
  - 記事は `MANUAL_ARTICLE_URLS`、スライドは `MANUAL_SLIDE_URLS` に追加する。
- 手動 URL を `manual` 投稿として既存の `externalArticles` Content Collection と RSS スナップショットへ統合する。
  - カードのタイトル・概要は OGP、Twitter Card、または HTML の `title` から取得する。
  - 公開日は HTML のメタデータや初回取得日時ではなく、設定マップの値を常に使用する。
  - 手動 URL を設定から削除すると、スナップショットと投稿一覧からも除外する。
- 新規 URL の HTML 取得に失敗した場合はビルドを失敗させる。取得済み URL の一時的な取得失敗時は、スナップショットを使って継続する。
  - この場合も公開日は設定値で更新できる。
- `postType` スキーマを `external | manual` に拡張する。

## Verification

- `pnpm format:check`
- `pnpm check`
- `pnpm lint`
- `pnpm build`
- Findy Tools と cdCon 2020 の公開日が、初回ビルド日時ではなく設定値になることを確認する。

## Assumptions

- 手動投稿のタイトルと概要は設定で上書きせず、対象ページの HTML メタデータを利用する。
- 公開日の正は `manualPosts.ts` の URL マップとする。
