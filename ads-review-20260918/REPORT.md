# PROJECT MENTORING 本番サイト・SEO・広告 最終改善報告

更新日：2026年9月18日  
本番URL：<https://project-mentoring.com/>  
本番ソース：`production-ready-20260917/public/`  
Cloudflare Pagesデプロイ：`https://5c20609a.project-mentoring.pages.dev`

## 結論

本番サイトは、現行商品（中高生、オンライン1対1、8週間、60分×8回、200,000円税込）に統一した。主要4ページはindex可能で、canonical、sitemap、robots、OGP、構造化データ、内部リンクを整備済み。フォームは成功時だけ`generate_lead`を1回送る実装を維持し、解析拒否時もフォーム送信は可能だが計測は抑止する。キャンペーンの予算・入札・コンバージョン目標・停止状態は変更していない。

## A. 実際に変更したもの

| ファイル | 変更内容 |
|---|---|
| `public/index.html` | 現行商品との整合、HOMEのtitle/description/OGP/Twitter、WebSite・Organization JSON-LD、共通OG画像、Hero WebP、内部リンクを更新。H1「AI時代に、どう学ぶか。」は維持。 |
| `public/projects.html` | canonical・OGP・Twitterを整備し、8件を実績ではなくテーマ例として明示。相談導線を維持。 |
| `public/faq.html` | title/descriptionを検索内容が分かる表現へ更新。FAQPage schemaは追加していない。 |
| `public/consultation.html` | 無料相談の対象が分かるtitle/descriptionへ更新。送信前確認と成功後イベントの導線を維持。 |
| `public/404.html` | noindexを維持し、HOME・無料相談への復帰導線を追加。 |
| `public/site.css` | ブランド外観を保ったままコントラスト、フォーカス、320px表示を調整。 |
| `public/analytics.js` | 同意前の計測抑止、拒否状態、PIIを含めないイベント送信を維持・検証。 |
| `public/script.js` | 送信失敗時の入力保持、二重送信防止、成功応答後のみの`generate_lead`、honeypot処理を検証。 |
| `public/_redirects` | `/index.html`、`.html`、末尾スラッシュをcanonical URLへ301統一。旧3サービスURLは`/projects`へ統合済み。 |
| `public/robots.txt` / `public/sitemap.xml` | 主要4URLだけをindex対象として明示。 |
| `public/assets/hero-student.webp` | HeroをWebP化し、LCP用preload・`fetchpriority=high`を適用。 |
| `public/assets/og-project-mentoring.jpg` | 1200×630の共通OG画像を作成。 |
| `marketing/google-ads-assets.json` | 現行仕様のP-MAX用見出し・説明文・サイトリンク・search themeを定義。 |
| `marketing/assets/pmax-v3/` | SERVICE / PROJECT EXAMPLES 7点、MENTOR 2点、BRAND 1点の広告画像候補を作成。AI生成人物は0点。MENTORのみ講師本人の既存実写を使用。 |
| `marketing/google-ads-pmax.md` | P-MAX登録内容と停止維持条件を文書化。 |
| `marketing/google-ads-search-draft.md` | 完全一致・フレーズ一致中心の未配信Search案を作成。 |
| `browser-regression.cjs` / `seo-check.cjs` | レスポンシブ、フォーム、計測、SEOを自動検証。 |

旧価格`198,000円`および完成保証に読める旧広告表現は、公開用・広告用ファイルから検出されない。

## B. SEO

| ページ | 変更前のtitle | 変更後のtitle | 変更後のdescription |
|---|---|---|---|
| HOME | AI時代に、どう学ぶか。｜PROJECT MENTORING | 中高生向けAI・技術プロジェクトの1対1指導｜PROJECT MENTORING | 中高生向けのオンライン1対1プロジェクト指導。AI・ソフトウェア・データ分析などを使い、8週間で仮説・試行・評価・判断を繰り返します。現役AI研究開発者が伴走。 |
| Projects | 中高生向けAI・プログラミングのプロジェクト例｜PROJECT MENTORING | 維持 | 成果物の豪華さではなく、試す・確かめる・判断する・改善する過程が見える8つの取り組み例。 |
| FAQ | よくある質問｜PROJECT MENTORING | 中高生向けAI・プロジェクト指導のよくある質問｜PROJECT MENTORING | 対象、テーマ、8週間の進め方、料金、無料相談など、受講前によくある質問に回答します。 |
| Consultation | PROJECT MENTORING｜無料相談 | 保護者向け無料相談｜中高生のAI・技術プロジェクト指導｜PROJECT MENTORING | 中高生向けオンライン1対1プロジェクト指導について、保護者向け20分無料相談を受け付けています。有料受講の申込みではありません。 |

全4ページで次を確認済み。

- HTTP 200、self canonical、index、固有title、H1 1件
- OGP / Twitter Card / 1200×630絶対URL画像
- HOME：WebSite + Organization、内側3ページ：BreadcrumbList
- HOMEからProjects / FAQ / Consultationへ通常の`<a>`リンク
- sitemap掲載、robots許可、preview/review URLの混入なし
- `/index.html`および`.html`重複は301

`www.project-mentoring.com`はDNS未設定であり重複ページは存在しない。将来wwwを追加する場合はapexへ301する。

## C. Google Ads

### 管理画面で入力済み

- キャンペーン：`高校生の技術プロジェクト`
- 種別：P-MAX
- 状態：停止中のまま
- 日予算：500円のまま
- Final URL：`https://project-mentoring.com/`
- Business name：`PROJECT MENTORING`
- Headlines：15件
- Long headlines：5件
- Descriptions：5件
- Images：管理画面の既存入力は維持。サービス体験を主役にした新候補10点はレビュー用に作成し、未登録
- Creative mix：SERVICE / PROJECT EXAMPLES 70%、MENTOR 20%、BRAND 10%、AI生成人物0%
- Mentor：西邑勇人本人の実写を使用した2点のみ。生成人物・stock人物・架空の生徒写真は候補から除外
- Sitelinks：6件を入力済み
- 動画：人物を使わず8週間の体験を示す18秒previewを16:9・1:1・9:16で作成。未登録

### Headlines

1. AIプロジェクト
2. 中高生向けオンライン1対1
3. 中高生の1対1技術プロジェクト
4. 8週間の技術プロジェクト
5. AI時代の学びを1対1で
6. AIを使って考える8週間
7. 現役AI研究開発者が伴走
8. 仮説から改善まで伴走
9. 企画・試行・評価・改善
10. 興味からテーマを決める
11. 中高生のAIプロジェクト
12. 保護者向け無料相談
13. 20分オンライン無料相談
14. 8週間20万円の個別指導
15. AI・ソフトウェアを1対1

### Long headlines

1. 中高生がAIを使いながら、仮説・試行・評価・判断を繰り返す8週間の1対1指導
2. AIに任せるのは作業。人が担うのは判断。現役AI研究開発者が1対1で伴走
3. 興味のあるテーマから始め、AI・ソフトウェア・データ分析を8週間で試す
4. 決まった教材ではなく、自分のテーマで試し、結果を評価し、次の一手を決める
5. 中高生向けオンライン1対1。8週間20万円（税込）、保護者向け無料相談20分

### Descriptions

1. 中高生対象。8週間20万円（税込）。60分×8回＋期間中のテキスト相談。
2. AIを使いながら、仮説・試行・評価・判断を繰り返す1対1プロジェクト指導。
3. 興味のあるテーマから始め、AI・ソフトウェア・データ分析などに取り組みます。
4. 現役AI研究開発者が伴走。決まった教材ではなく、自分のテーマで試します。
5. まずは保護者向け20分オンライン無料相談。有料受講の申込みではありません。

### Sitelinks

1. プロジェクト例 → `/projects`
2. 8週間の進め方 → `/#project`
3. 指導者について → `/#mentor`
4. 料金・提供内容 → `/#price`
5. よくある質問 → `/faq`
6. 保護者向け無料相談 → `/consultation`

### Search themes

中高生 AI 個別指導、高校生 AI 学習、中学生 AI 学習、高校生 プログラミング 個別指導、中高生 プログラミング オンライン、プログラミング 家庭教師 高校生、探究学習 中高生、探究 プロジェクト 中高生、AI 探究学習、中高生 プロジェクト学習、中高生 データ分析、中高生 アプリ開発。

`node marketing/validate-google-ads.cjs`で、日本語等の全角を2、半角を1とするGoogle広告の重み付き方式で44アセットを再検証した。すべて上限内で、広告文の変更は不要だった。結果は`marketing/google-ads-character-check.json`に保存した。

## D. Analytics / conversion

送信経路は次の順序。

1. 必須項目・プライバシー同意を検証
2. 確認ダイアログを表示
3. FormSubmitへ1回だけ送信
4. 成功レスポンスを確認
5. 成功UIを表示しフォームをreset
6. `window.MentoringAnalytics.leadAccepted(requestId)`を1回だけ呼び、GA4 `generate_lead`を送る

validation error、確認表示、送信失敗、honeypot、二重クリックでは`generate_lead`は発火しない。イベントに氏名、メール、自由記述、生徒情報を含めない。lead valueへ200,000円を送らない。Enhanced Conversionsは未使用。

analytics consentが`denied`でもフォーム送信と成功表示は可能だが、`leadAccepted(requestId)`は同意状態を確認し、`generate_lead`を送信しない。利用者の拒否を広告計測のために上書きしない現行実装を維持している。

以前の本番確認ではGA4リアルタイムに`page_view`、`consultation_click`、`generate_lead`各1件が表示済み。今回も本番フォームで合成データ1件の成功UIを確認したが、Gmail到着とGA4管理画面反映はこの試験分について再確認していない。

## E. Performance / QA

| 指標 | 変更前 | 変更後（本番） |
|---|---:|---:|
| Lighthouse Performance | 72 | 97 |
| Accessibility | 96 | 100 |
| SEO | 100 | 100 |
| LCP | 5.5秒 | 2.2秒 |
| FCP | 2.7秒 | 1.8秒 |
| CLS | 0 | 0 |
| TBT | 0ms | 0ms |
| 転送量 | 491KiB | 101KiB |

検証結果：

- `seo-check.cjs`：PASS（4ページ）
- `test-consent.cjs`：26項目PASS
- `production-audit.py`：PASS
- `browser-regression.cjs`：PC・タブレット・320px、全4ページ、横スクロールなし
- 確認ダイアログ→入力へ戻る：10回連続成功
- 送信失敗：入力保持、lead 0
- 成功モック：fetch 1回、lead 1回
- 二重クリック：送信1回
- honeypot：送信0回、lead 0

## F. 残タスク

1. Google広告の停止中P-MAXは最終保存していない。カテゴリ別画像10点と人物なし動画previewをレビューし、採用素材だけを登録する。保存しても配信再開・予算変更・支出開始はしない。
2. 保存後、管理画面で停止状態、日予算500円、`generate_lead`主要、旧2件サブを再確認する。
3. Search Consoleは既存ドメインプロパティの所有権確認済み。Google側の反映後にsitemap処理結果と主要4URLのインデックス状況を再確認する。
4. P-MAX動画は3比率のpreviewのみ。Google広告・YouTubeへの登録はレビュー後に行う。
5. Search広告は、一般検索をHOME、無料相談意図を`/consultation`へ送る未配信draftへ修正した。キャンペーン作成・開始、予算確定は行っていない。

## 状態の区分

- **本番で実確認**：4ページ公開、HTTPS、SEOメタ、画像、リンク、フォーム確認、合成データ送信成功UI、レスポンシブ表示、Lighthouse。
- **自動・模擬確認**：失敗送信、二重送信、honeypot、成功時1回だけの`generate_lead`コードパス。
- **管理画面で確認**：Google広告停止中、日予算500円、更新アセットの入力、画像・ロゴアップロード。
- **未確定**：広告アセットの最終保存、今回分のGmail到着・GA4管理画面反映、Googleの審査・配信実績・自然検索の掲載結果。
