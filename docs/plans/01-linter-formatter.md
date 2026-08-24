# Linter & Formatter 導入計画および仕様

## 1. 概要

本プロジェクト（Astro + TypeScript 7系 + Tailwind CSS を想定したポートフォリオ兼ブログ）において、コードの品質担保とフォーマット自動化を行うための Linter / Formatter の選定および導入仕様です。

---

## 2. 採用構成: ESLint + Prettier (TypeScript 7系対応)

### 決定方針

- **TypeScript 7.0.2** の環境を維持。
- Formatter は **Prettier**（`prettier-plugin-astro` + `prettier-plugin-tailwindcss`）で一括管理。
- Linter は **ESLint (Flat Config)** を使用し、`eslint-plugin-astro` で `.astro` テンプレート構文やアクセシビリティをチェックし、`eslint-config-prettier` で Prettier との重複・競合を無効化。
- 型チェックは **TypeScript 7 Compiler (`tsc --noEmit`)** にて実行。

---

## 3. 構成詳細

### 導入済み依存パッケージ (devDependencies)

- **Prettier関連**:
  - `prettier`: フォーマッタ本体
  - `prettier-plugin-astro`: `.astro` ファイルの整形
  - `prettier-plugin-tailwindcss`: Tailwind CSS クラス順序の自動整列
- **ESLint関連**:
  - `eslint`: Linter本体 (v10 Flat Config)
  - `eslint-plugin-astro`: Astro 構文・ルール
  - `eslint-config-prettier`: Prettier との競合ルール無効化
- **TypeScript**:
  - `typescript`: TS 7.0.2

### 設定ファイル

1. **`eslint.config.mjs`**
   - Flat Config 形式で記述。
   - `ignores` に `dist/`, `.astro/`, `node_modules/`, `public/`, `pN-blog-hub/` などを指定。
   - `eslint-plugin-astro` の推奨設定 (`...eslintPluginAstro.configs.recommended`)
   - `eslint-config-prettier` でフォーマット競合を無効化。
2. **`.prettierrc.mjs`**
   - プラグインに `prettier-plugin-astro`, `prettier-plugin-tailwindcss` を指定。
   - overrides で `*.astro` ファイルの parser を `astro` に設定。
3. **`.prettierignore`**
   - `dist/`, `.astro/`, `node_modules/`, `public/`, `pN-blog-hub/`, `pnpm-lock.yaml` を除外。
4. **`tsconfig.json`**
   - 参照ディレクトリ `pN-blog-hub` を exclude に追加し、プロジェクト本体の型検査を独立化。
5. **`.vscode/` 連携**
   - `.vscode/settings.json`: 保存時自動フォーマット（`editor.formatOnSave: true`）、ESLint 自動修正を有効化。
   - `.vscode/extensions.json`: Astro, ESLint, Prettier の推奨拡張機能を定義。

### `package.json` スクリプト

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "check": "tsc --noEmit",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

---

## 4. 検証結果

| コマンド                | 結果    | 内容                                     |
| :---------------------- | :------ | :--------------------------------------- |
| `pnpm run format:check` | ✅ パス | 全ファイルが Prettier 規約に準拠         |
| `pnpm run lint`         | ✅ パス | `.astro`, `.mjs`, `.ts` のリント正常終了 |
| `pnpm run check`        | ✅ パス | `tsc --noEmit` 型チェック正常終了        |
| `pnpm run build`        | ✅ パス | Astro SSG ビルド正常完了                 |
