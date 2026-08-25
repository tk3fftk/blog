# Diary URL 段落のOGPカード化

## Summary

`src/content/diary/**` のMarkdownで、HTTP(S) URLだけからなる段落をURLカードへ変換する。remarkで専用ノードを生成し、rehypeでOGPを取得してカード用HTMLへ置換する。

## Implementation Changes

- AstroのMarkdownプロセッサを `@astrojs/markdown-remark` の `unified()` に切り替え、カスタムremark／rehypeプラグインを登録する。
- remarkプラグインはdiary投稿だけを対象に、URLのみの段落をURL属性付きのカスタムノードへ変換する。
- rehypeプラグインはカスタムノードをOGPカードHTMLへ置換する。OGP取得は5秒でタイムアウトし、失敗時はホスト名とURLのみのカードへフォールバックする。
- OGP情報はキャッシュせず、各ビルドで取得する。
