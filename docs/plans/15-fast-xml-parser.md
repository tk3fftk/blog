# fast-xml-parser の依存更新

`@astrojs/rss@4.0.19` が指定する `^5.5.7` の範囲内で、`fast-xml-parser` を `5.11.2` から `5.12.1` に更新する。
pnpm 11.22.0 でロックファイルを再生成し、連動して `fast-xml-builder` は `1.3.2`、`is-unsafe` は `2.0.3`、`strnum` は `2.5.1` に解決された。
公開 npm レジストリを使用し、既存の `minimumReleaseAge`（3日）を適用した。例外の追加は不要だった。

## 検証

Node.js 24.13.0 と pnpm 11.22.0 を使用した。

- `pnpm install --frozen-lockfile --registry=https://registry.npmjs.org` が成功。
- ロックファイルと `pnpm why fast-xml-parser` で、唯一の依存経路 `blog → @astrojs/rss → fast-xml-parser` が `5.12.1` に解決され、下限の `5.12.0` を満たすことを確認。
- `pnpm format:check`、`pnpm run lint`、`pnpm run build`、`pnpm run check` が成功。
