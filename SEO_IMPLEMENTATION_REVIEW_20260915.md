# PROJECT MENTORING SEO実装・本番確認報告

確認日：2026-09-15（日本時間）  
本番：https://project-mentoring.com/  
Cloudflare Pages最終配置：https://9d85ccb6.project-mentoring.pages.dev/

## 結論

既存LPのデザイン、教育思想、料金、フォーム、同意方式、Google広告のイベント名を維持し、検索流入の受け皿となる4ページとFAQを整備した。HOMEをハブにし、header・footer・本文から主要ページへ通常の`<a>`リンクで到達できる構造にした。

Google検索のサイトリンクは自動生成であり表示保証はできない。今回完了したのは、主要ページの名称、内部リンク、title、H1、canonical、パンくず、sitemap、indexabilityを揃えた「サイトリンクが生成されやすいサイト構造への最適化」である。

## 実装した変更

### HOME：`index.html`

- titleとdescriptionを中高生向けAI・プログラミングのプロジェクト指導として明確化
- Open Graph、Twitter Card、canonical、`index,follow`を整備
- `WebSite`と`Organization`のJSON-LDを追加。公開済みの事実だけを使用し、住所・電話・実績・レビュー等は追加していない
- 主要3サービスへの案内を追加し、HOMEから1クリックで到達可能にした
- desktop headerのサービスメニュー、mobile nav、footerを主要ページへ接続
- HOMEの代表FAQからFAQ全体へリンク
- 既存Hero、制作例、8週間ロードマップ、講師、料金、フォームを維持

### 新規ページ

- `/ai-project`：AIの操作ではなく、問い・検証・評価・改善を扱うAIプロジェクト指導
- `/programming-project`：教材型の文法学習ではなく、本人が作りたい作品を完成・改善する指導
- `/inquiry-learning`：調べて終わらず、制作・実験・データ分析で問いを確かめる探究支援
- `/faq`：料金、期間、AI利用、テーマ、保護者共有、テキスト相談等の14問

各ページに固有のtitle、description、H1、canonical、Open Graph、Twitter Card、パンくずUI、`BreadcrumbList`、関連ページリンク、料金、相談CTAを実装した。テーマ例は実績と誤認されないよう明記した。

### 相談ページ：`consultation.html`

- 固有title、description、canonical、OGP、Twitter Card、パンくずを追加
- header/footerを全体構造と揃えた
- H1を1つに整理
- フォーム項目、送信先、確認・送信処理は変更していない

### 技術ファイル

- `seo.css`：既存の色・書体・余白を使ったSEOページ、サービス案内、パンくず、responsive navigationの追加スタイル
- `sitemap.xml`：正規URL6件へ更新
- `robots.txt`：全面クロール許可と本番sitemapを確認
- `analytics.js`：既存の同意仕様とイベント名を維持し、各ページの現在URLと`document.title`をGA4へ送るよう最小修正
- `script.js`：`/#privacy`の直接リンクを既存ダイアログへ接続。フォーム処理は維持
- `404.html`：既存noindexを維持

独立した`/pricing`は作っていない。現在の料金情報はHOMEの料金セクションで過不足なく説明されており、同じ内容を薄く複製するより`/#price`へ集約する方が利用者に自然と判断した。

## SEO keyword / intent mapping

| URL | 主な検索意図 | ページの役割 |
|---|---|---|
| `/` | 中高生 技術プロジェクト 個別指導、AI、プログラミング | サービス全体、信頼、進め方、料金、相談のハブ |
| `/ai-project` | 高校生・中学生 AIプロジェクト、AI個別指導 | AI出力の検証・評価・改善まで扱う違いを説明 |
| `/programming-project` | 高校生・中学生 プログラミング個別指導、作品制作 | 作りたいものから逆算する制作型指導を説明 |
| `/inquiry-learning` | 高校生 探究学習 個別指導、探究メンター | 問いを技術で確かめる探究支援を説明 |
| `/faq` | サービス名＋料金・期間・内容等 | 検討時の具体的な疑問へ回答 |
| `/consultation` | PROJECT MENTORING 問い合わせ・無料相談 | 保護者向け相談申込み |

## Sitelink readiness

| 候補 | URL | Header | Footer | HOME本文 | 固有title | 固有H1 | self canonical | sitemap | 本番indexability |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| AIプロジェクト | `/ai-project` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | HTTP 200 / index |
| プログラミング・作品制作 | `/programming-project` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | HTTP 200 / index |
| 探究学習 | `/inquiry-learning` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | HTTP 200 / index |
| 料金・サービス内容 | `/#price` | ✓ | ✓ | ✓ | HOME内 | section見出し | HOME | HOME | HTTP 200 / index |
| よくある質問 | `/faq` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | HTTP 200 / index |
| 無料相談・問い合わせ | `/consultation` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | HTTP 200 / index |

HOME以外の主要ページには、画面上のパンくずと同内容の`BreadcrumbList`を設置した。関連する3サービスは文脈に沿って相互リンクし、orphan pageはない。navigation、title、H1、breadcrumb、footerでは同じページ名を自然な範囲で統一した。

## 実際に確認したこと

### 本番HTTP

- `/`、`/ai-project`、`/programming-project`、`/inquiry-learning`、`/faq`、`/consultation`：HTTP 200
- `/robots.txt`、`/sitemap.xml`：HTTP 200
- 存在しないURL：HTTP 404
- `http://project-mentoring.com/`：HTTPSへ301
- `/index.html`、`/ai-project.html`、`/ai-project/`：正規URLへ308
- 大文字の`/FAQ`：404
- 主要ページに`X-Robots-Tag: noindex`なし
- `www.project-mentoring.com`はDNS未設定。正規ホストは一貫してnon-wwwで、重複ページは発生していない

### HTML・SEO自動検査

`seo-check.cjs`で以下を検査し合格：

- indexable 6ページの固有title・description・H1
- self canonical
- accidental noindexなし
- OGP / Twitter Card / site name
- JSON-LDがすべてJSONとしてparse可能
- HOMEから主要ページへのcrawlable link
- 全主要HTMLの内部リンク先とhash target
- sitemapの正規URL、重複なし
- robotsのAllowとsitemap指定
- 404のnoindex
- 既存フォームIDと`generate_lead`成功hook
- analytics変更が現在path/title取得の範囲だけであること

### ブラウザ・responsive

- HOME、新規3サービス、FAQ、相談ページをPC 1440pxとスマホ390pxで表示
- 6ページすべて横スクロールなし、main本文表示、H1 1つ
- スマホメニューを開き、FAQへ遷移
- FAQを開いて回答表示
- 新規ページのHero、料金、関連ページ、footerを目視
- ブラウザconsoleのerror/warningなし
- Heroの日本語改行を調整し再確認

### フォーム・計測の回帰確認

- スマホ幅で相談フォームへ合成データを入力し、確認ダイアログまで表示
- 本番への実問い合わせ送信は行っていない
- `test-consent.cjs`：28 assertions合格。実Google/FormSubmit通信なしのsynthetic DOMテスト
- `page_view`、`consultation_click`、`generate_lead`の既存イベント名を維持
- 拒否、解析のみ、解析＋広告計測、保存済み選択、期限切れ、撤回、Googleタグ遮断時のフォーム非依存を検査
- 氏名、メール、学年、相談内容、受付番号を計測へ送らない仕様を維持

### パフォーマンス上の確認

- HOMEのLCP候補画像は78,404 bytesのWebP、1200×800の寸法指定、`fetchpriority="high"`
- JavaScript framework、外部font、新規SEOライブラリを追加していない
- 新規サービスページは静的HTMLで、本文と内部リンクが初期HTMLに存在
- 画像のない新規ページは既存CSSと小さな追加CSSだけで表示
- Lighthouse実行環境は導入されておらず、依存追加のためだけの導入は行っていない。LCP / INP / CLSの数値はSearch Consoleの実利用データで継続確認する

## 変更していない重要箇所

- 月99,000円、標準約8週間、2か月198,000円の料金
- 教育思想、既存Hero、制作例、講師紹介と写真
- FormSubmitのendpoint、公開メール窓口、フォーム項目
- GA4測定ID、同意の3選択、広告パーソナライズ無効
- Google広告キャンペーン、予算、入札、配信設定
- 架空の実績、口コミ、合格実績、学校名、勤務先名は追加していない

## 人間が行うSearch Console作業

1. Google Search Consoleで`project-mentoring.com`をドメインプロパティとして追加する
2. 表示されたTXTレコードをCloudflare DNSへ追加し、所有権を確認する
3. `https://project-mentoring.com/sitemap.xml`を送信する
4. URL検査でHOME、`/ai-project`、`/programming-project`、`/inquiry-learning`、`/faq`、`/consultation`を確認し、必要ならインデックス登録をリクエストする
5. 数日後に「ページのインデックス登録」で6URLの状態を確認する
6. データが蓄積したら「検索パフォーマンス」でquery、page、CTRを確認する

Search Consoleのverification tokenは推測・追加していない。Googleのサイトリンク表示は管理画面から指定できないため、インデックス後にブランド検索結果を観察する。

## 未解決事項

- Search Consoleの所有権確認とsitemap送信は、GoogleアカウントおよびCloudflare DNSでの本人操作が必要
- サイトリンクの実表示、検索順位、Core Web Vitalsのフィールド値はGoogleのクロール・データ蓄積後に確認する
- `www`ホストを利用する予定がある場合だけ、non-wwwへの転送設定を追加する。現在の公開・canonical・内部リンクはすべてnon-wwwで統一済み

