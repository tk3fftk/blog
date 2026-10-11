# diary の RSS 配信

## 実装

- Astro 公式の `@astrojs/rss` を使い、`/diary/rss.xml` をビルド時に生成する。
- `getCollection('diary')` の全記事を公開日の降順に並べ、タイトル、公開日、既存の description、記事リンクを配信する。本文全文と外部記事は含めない。
- フィード名は `Diary | tk3fftk.dev`、フィード全体の説明は空文字、言語は `ja` とする。
- 記事 URL は Astro の `site` を基準とした絶対 URL で、既存の `/diary/{id}` と同じ末尾スラッシュなしの形式にする。
- フィード名とパスはサイト設定で共有し、トップページ、記事一覧の共通コンポーネント、diary 個別ページに RSS 自動検出タグを追加する。
- Diary 一覧の `Diary` 見出しのすぐ右に、RSS アイコンだけの購読リンクを配置する。共通ヘッダーには RSS リンクを置かない。
- `PostListPage` の `heading-actions` 名前付きスロットで見出し横の要素を受け取り、見出しと中央揃えで横並びにする。
- RSS リンクは `aria-label="Diary RSS"` とフォーカス表示を備え、アイコン SVG は `aria-hidden="true"` とする。同じタブで `/diary/rss.xml` を開く。

## 検証

- `pnpm check`、`pnpm lint`、変更ファイルの Prettier チェック、`pnpm build` を実行する。
- 生成 XML を解析し、記事件数、並び順、各項目、絶対 URL、日本語と特殊文字、空のフィード説明を確認する。
- `pnpm exec astro dev --background` で起動し、HTTP 200、XML の Content-Type、購読導線と自動検出タグを確認後、`pnpm exec astro dev stop` で停止する。
- ローカル Node.js で実行できない場合は公式 `node:22-bookworm` Docker image とコンテナ専用の依存ディレクトリで検証する。本番デプロイは行わない。

## 検証結果

- ローカル Node.js v22.15.0 / pnpm v10.10.0 で検証した。Docker は不要だった。
- `pnpm check`、`pnpm lint`、変更ファイルの Prettier チェック、`pnpm build` は成功した。Cloudflare adapter の生成先は `dist/client/diary/rss.xml`。
- 生成 XML と開発サーバーのレスポンスを `rss-parser` で解析し、既存 diary 2 件のみが公開日の降順で配信され、タイトル、概要、公開日、絶対 URL が Markdown の frontmatter と一致することを確認した。
- フィード全体の説明は `<description/>`、言語は `ja`、本文全文は含まれないことを確認した。日本語と XML 特殊文字の往復、および記事 0 件のフィード生成も確認した。
- `/diary/rss.xml` は HTTP 200 / `application/xml`。トップ、diary 一覧、article 一覧、diary 個別 2 ページの自動検出タグを確認した。初回実装時の共通ヘッダーの購読リンクは、後述の変更で Diary 見出し横に移動する。
- バックグラウンド開発サーバーを停止し、`astro dev status` で停止状態を確認した。
- ビルド時に既存の外部記事取得が 1 件タイムアウトしたが、既存の snapshot フォールバックでビルドは成功し、diary RSS に影響はなかった。

## CI の依存インストール修正

- PR #20 の CI は pnpm 11.28.5 の `pnpm install --frozen-lockfile` で、公開後 3 日未満の `strnum@2.5.1` を拒否した。ローカル pnpm 10 の検証ではこのポリシー検証を確認できていなかった。
- `fast-xml-parser@5.11.2` の依存条件 `strnum: ^2.4.2` を満たし、2026-08-14 公開の `strnum@2.4.2` に lockfile を修正する。integrity は npm レジストリの値と一致させる。
- `minimumReleaseAge: 4320` と既存の例外設定を維持し、CI と同じ pnpm 11.28.5 でクリーンな依存インストールと公開日時ポリシーの検証を行う。
- フォーマット、lint、ビルド、型チェックを再確認し、修正コミットを同じ PR ブランチに push して CI 結果を確認する。
- 分離した検証ディレクトリで pnpm 11.28.5 の frozen-lockfile インストールが成功し、全 658 エントリの supply-chain policy 検証が通った。
- Windows の CRLF と、通常ファイルとしてチェックアウトされた `CLAUDE.md` シンボリックリンクを除いた Linux 相当のファイル構成で、リポジトリ全体のフォーマット確認が成功した。lint、ビルド、型チェックも成功した。

## 購読リンクの配置変更

- 共通ヘッダーの RSS リンクを削除し、Diary 一覧の見出し横にインライン SVG の RSS アイコンを配置する。通常色は既存の控えめな文字色、ホバー時は白とする。
- PC とモバイルでの配置、リンク遷移、キーボード操作、Diary 一覧だけに表示されること、RSS 配信内容と自動検出タグが維持されることを確認する。
- 1280px と 390px 幅のブラウザーで、Diary 見出しのすぐ右に RSS アイコンが中央揃えで配置されることを確認した。
- Tab で `Diary RSS` にフォーカスし、`:focus-visible` と 2px のアウトラインが表示されることを確認した。Enter とクリックで RSS をリクエストし、サーバーログの HTTP 200 を確認した。リンクに `target` は付けない。
- トップ、diary 一覧、article、slide、profile、diary 個別 2 ページのヘッダーに RSS リンクがないこと、表示リンクが diary 一覧の見出し横だけにあることを HTTP レスポンスで確認した。
- RSS の HTTP 200 / `application/xml`、ビルド生成 XML との一致、既存の自動検出タグの維持を確認した。
- 変更ファイルのフォーマット、lint、型チェック、ビルドは成功した。バックグラウンド開発サーバーは検証後に停止した。

## RSS アイコンのバランス調整

- RSS アイコンを 20px から 24px に拡大し、通常色の不透明度を 60% から 80% に上げる。
- 見出しとクリック領域の間隔を 12px から 4px に縮める。40px 四方のクリック領域とキーボードのフォーカス表示は維持する。
- PC とモバイルで配置を確認し、変更ファイルのフォーマット、lint、型チェック、ビルドを検証する。
- 1280px / 390px 幅で表示を確認し、実際のアイコン幅 24px、間隔 4px、クリック領域 40px 四方を確認した。変更ファイルのフォーマット、lint、型チェック、ビルドは成功した。
