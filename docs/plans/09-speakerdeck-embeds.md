# Speaker Deck 埋め込み型スライド一覧

## 実装内容

- `/slide` は Speaker Deck のスライド投稿だけを公開日降順で表示する。
- 各投稿の oEmbed API をビルド時に取得し、返却 HTML から検証済みの `https://speakerdeck.com/player/<id>` URL だけを抽出して固定の iframe へ渡す。oEmbed HTMLそのものは出力しない。
- iframe には `loading="lazy"` を付け、表示領域に近づくまでスライド本体の読み込みを遅延する。
- 一覧はモバイルで1列、`lg` 以上で最大2列にする。取得に失敗した投稿は Speaker Deck への外部リンクを残す。
- タイトルは最大2行とし、2行分の高さを常に確保して iframe の上端を揃える。3行目以降は省略する。
- `/slide` は静的生成を維持するため、oEmbed API を閲覧時には呼び出さない。ページ HTML は Cloudflare の静的アセット配信対象とし、iframe の配信・キャッシュは Speaker Deck に委ねる。

## 検証

- `pnpm check`
- `pnpm lint`
- `pnpm build`
- 生成した `/slide` に Speaker Deck iframe と `loading="lazy"` が含まれることを確認する。
- iframe の `src` が `https://speakerdeck.com/player/...` だけであり、`set:html` を使用していないことを確認する。
- 1行・2行・長文タイトルで iframe の開始位置が揃うことを確認する。
