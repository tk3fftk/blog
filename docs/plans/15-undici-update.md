# undici の更新

- `miniflare@5.20260820.0-alpha` は `undici@7.29.0` を固定指定している。pnpm の `overrides` でこの Miniflare バージョンの依存だけを `7.30.2` に更新する。
- `unifont@0.7.5` の `undici` は `^8.0.0` の範囲で `8.12.4` に更新する。
- 両バージョンは 2026 年 11 月 5 日に公開されており、既存の `minimumReleaseAge`（3 日間）を適用する。

## 検証

Node.js 24.13.0 と pnpm 11.22.0 を使用する。

- `pnpm update undici --depth 99 --lockfile-only` でロックファイルを再生成し、依存先が `7.30.2` と `8.12.4` に変わったことを確認する。
- `pnpm install --frozen-lockfile` と `pnpm why undici` でインストールと依存経路を確認する。
- `pnpm format:check`、`pnpm run lint`、`pnpm run build`、`pnpm run check` を実行する。

frozen install、依存経路の確認、整形チェック、ESLint、ビルド、TypeScript チェックはすべて成功した。ビルドでは外部記事 1 件の取得で HTTP 503 が発生し、既存のスナップショットにフォールバックした。
