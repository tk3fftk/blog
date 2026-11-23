# pnpm 依存の週次更新

## 設計

Dependabot の設定形式はバージョン 2 とする。ルートにある `package.json` と `pnpm-lock.yaml` を対象に、`package-ecosystem` を `npm`、`directory` を `/`、`schedule.interval` を `weekly` に設定する。

## 検証

Ruby の `YAML.safe_load` で `.github/dependabot.yml` を読み込み、構文を検証した。解析結果を期待値と照合し、バージョンが整数の 2 で、更新設定が上記の 1 件であることを確認した。
