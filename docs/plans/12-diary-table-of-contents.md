# Diary Table of Contents

## Summary

日記詳細ページの本文先頭に、Markdown本文のH2〜H3から生成した折りたたみ目次を表示する。

## Implementation

- Astro Contentの`render(post)`が返す見出し情報を利用し、H2とH3を目次項目にする。
- 項目は見出しのslugへリンクし、H3を字下げして階層を示す。
- `details` / `summary`を使い、初期状態は閉じた状態にする。対象見出しがない場合は目次を表示しない。
- 目次だけをシンプルなリストとして表示し、背景・文字・リンク色はサイトのダークテーマに合わせる。濃色のカード枠線や角丸は使わない。

## Verification

- `npm run check`
- `npm run build`
- ビルド結果で目次の表示条件、見出しリンク、折りたたみ状態を確認する。
