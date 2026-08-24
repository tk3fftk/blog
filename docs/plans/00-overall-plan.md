# ポートフォリオ兼ブログサイト 仕様書

`pN-blog-hub` のデザインとRSS集約の仕組みをベースにしつつ、自作Markdownブログ機能および手動での寄稿記事管理を追加したポートフォリオ兼ブログサイトの設計仕様書です。

---

## 1. プロジェクト概要

- **目的**: 自身のアクティビティ（自作ブログ・外部寄稿・Zenn/Qiita等の外部RSS記事）を一元化して発信するポートフォリオサイトの構築。
- **デザイン方針**: `pN-blog-hub` のシンプルかつ視認性の高いカード/リスト構造をベースに構築。
- **コンテンツ構成**:
  1. **自作Markdown記事**: リポジトリ内に保存し、本サイト上で記事詳細ページを展開。
  2. **外部RSS記事**: Zenn / Qiita / note / 個人外部ブログ等のRSSをビルド時に自動取得・表示。
  3. **手動登録記事**: RSS非対応サイトへの寄稿記事や登壇資料などをJSON等で個別追加。
- **閲覧体験**:
  - **トップページ**: すべてのコンテンツ（自作ブログ＋外部記事＋寄稿等）を統合した時系列タイムラインを表示。フィルター機能でタイプ別の切り替えが可能。
  - **個別一覧ページ**: 自作ブログのみ（`/blog`）、外部記事・寄稿・資料等のみ（`/articles`）の個別ページも提供。

---

## 2. 技術スタック & インフラ

| カテゴリ                 | 選定技術                | 理由                                                                                  |
| :----------------------- | :---------------------- | :------------------------------------------------------------------------------------ |
| **フレームワーク**       | **Astro** (v7.x)        | 超高速なSSG（静的サイト生成）機能とContent Layer API（Content Collections）を標準提供 |
| **アダプター**           | **@astrojs/cloudflare** | Cloudflare Workers / Pages 環境へ最適化された公式アダプター                           |
| **スタイリング**         | **Tailwind CSS**        | シンプルなUIの迅速な構築と応答性の高いレスポンシブ対応                                |
| **ホスティング**         | **Cloudflare Workers**  | 超低遅延なエッジコンピューティング環境での配信                                        |
| **CLI / デプロイツール** | **Wrangler**            | Cloudflare公式のビルド・デプロイCLIツール                                             |
| **ソースコード管理**     | **GitHub**              | リポジトリ名: `portfolio` または `portfolio-blog`                                     |
| **自動更新**             | **GitHub Actions**      | 1日1回のCronで再ビルドし、Wrangler経由で Cloudflare Workers へ自動デプロイ            |

---

## 3. ディレクトリ構成

```text
.
├── src/
│   ├── content/
│   │   ├── config.ts              # Content Layer API (Collections) 型・ローダー定義
│   │   └── blog/                  # 自作Markdown記事格納ディレクトリ
│   │       ├── my-first-post.md
│   │       └── hello-world.md
│   ├── data/
│   │   ├── feeds.ts               # 取得対象外部RSSのURLリスト
│   │   └── manual-posts.json      # 手動登録記事（寄稿・資料等）のリスト
│   ├── utils/
│   │   └── getMergedPosts.ts      # 3系統のコンテンツ統合・ソート関数
│   ├── components/
│   │   ├── Header.astro           # ヘッダー / ナビゲーション
│   │   ├── Footer.astro           # フッター
│   │   ├── PostCard.astro         # 記事表示用カードコンポーネント
│   │   ├── FilterNav.astro        # タブ/フィルター切替コンポーネント
│   │   └── Badge.astro            # 出典タグ（Blog / Zenn / 寄稿 等）
│   ├── layouts/
│   │   └── Layout.astro           # 基本レイアウトコンポーネント
│   └── pages/
│       ├── index.astro            # 全コンテンツ統合タイムライン（インタラクティブフィルター付き）
│       ├── blog/
│       │   ├── index.astro        # 自作ブログ記事のみの一覧ページ
│       │   └── [...slug].astro    # 自作ブログ用記事詳細ページ
│       └── articles/
│           └── index.astro        # 外部記事・寄稿・資料等の一覧ページ
├── public/                        # ファビコン、OGP画像等の静的ファイル
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions 用ワークフロー (Workers デプロイ)
├── astro.config.mjs               # Cloudflare アダプター設定
├── wrangler.jsonc                 # Cloudflare Workers 用設定ファイル
├── tailwind.config.cjs
└── package.json
```
