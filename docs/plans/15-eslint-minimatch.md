# ESLint の minimatch 更新

ESLint の依存範囲のメジャーを維持し、`^10.15.0` を指定する。ESLint 10.15.0 と、その依存先の `@eslint/config-array` 0.23.6 がともに minimatch 11 系に対応している。pnpm 11.22.0 でロックファイルを再生成し、両経路を 11.0.8 に解決した。

公開 npm レジストリを使用する。既存の `minimumReleaseAge` を適用し、今回の更新に伴う例外の追加は不要だった。

## 検証

- ロックファイル内の minimatch は 11.0.8 のみ。インストール後に各親パッケージからの解決結果も確認した。
- minimatch 11.0.8 の Node.js 要件は `20 || >=22`。ESLint と `@eslint/config-array` の Node.js 要件は更新前と同じで、CI と同じ Node.js 24 系の 24.13.0 で確認した。
- 両親パッケージが使う CommonJS の `Minimatch` で通常のファイルパターンの一致・不一致を確認した。ESLint API でビルド出力が除外され、Astro ページが対象になることも確認した。
- `pnpm install --frozen-lockfile --registry=https://registry.npmjs.org`、`pnpm format:check`、`pnpm run lint`、`pnpm run build`、`pnpm run check` が通過した。
- `@astrojs/tailwind` の Astro と Tailwind CSS に対する既存の peer 依存警告を確認した。ビルドでは外部サイトの HTTP 503 に対して既存のスナップショットへのフォールバックが機能した。
