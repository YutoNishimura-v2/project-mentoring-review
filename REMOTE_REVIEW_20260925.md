# Remote LP review — 2026-09-25

状態：remote previewの実画面検証完了。ユーザー／ChatGPTレビュー待ち。本番反映は未承認・未実施。

- [Home（今回のdeployment固定URL）](https://3e171ee3.project-mentoring.pages.dev/)
- [Consultation（今回のdeployment固定URL）](https://3e171ee3.project-mentoring.pages.dev/consultation)
- [Cloudflare branch alias](https://review-lp-positioning-202609.project-mentoring.pages.dev/)
- Git branch：`review/lp-positioning-20260925`。配置payload commit：`e002acf6c2c90380fd6b5c67787202bac3ac54dc`。
- 本番source側のHero修正commit：`a6c3a16`（review branchのみ）。

## 今回のコピー差分

Hero補足のみ「海外大学・留学・国内総合型選抜も視野に、自分の興味を深めたい中高生へ。」から **「海外大学や総合型選抜も視野に、自分の興味を深めたい中高生へ。」** へ変更。読点での改行は維持。

列挙による進学塾らしさを弱め、技術プロジェクト指導という本体を維持した。それ以外のpositioning修正、料金200,000円（税込）、8週間・オンライン1対1、既存のデザインは維持。対象セクション・consultation・descriptionには、ユーザーの「それ以外は原則維持」に従い初回案の進路表現が残る。

## Previewの構成と隔離

既存Cloudflare Pages `project-mentoring` はDirect Uploadでproduction branchが `main`。既存認証を使い、公式の[branch preview](https://developers.cloudflare.com/pages/configuration/preview-deployments/)として、`remote-preview/` だけを `--branch=review-lp-positioning-20260925` で配置した。[Direct Uploadの仕様](https://developers.cloudflare.com/pages/get-started/direct-upload/)に従う。課金・新規サービス登録・DNS変更なし。

`build-remote-preview.py` はレビュー版の生成専用で、deployは行わない。production用のフォーム・解析・同意処理には手を入れていない。

- 全ページのmeta robotsとHTTP X-Robots-Tagが `noindex,nofollow`。常設のREVIEW PREVIEWラベル。
- reviewOnly=true、送信endpoint空、実送信より前に終了するレビュー用フォーム分岐。
- 予約リンクはreview内へのリンクに置換。外部予約には進まない。
- analytics.enabled=false、measurementId空。analytics.jsは通信しないstub。
- 配信CSPが `connect-src 'none'; form-action 'none'`、script/image等は同一originに限定。
- 公開payloadに認証ファイル・token・credentialは含めない。Wranglerキャッシュはgitignore対象。OG画像は既存の公開画像を同梱してリンク切れを解消。

## Remote URLそのものの検証

| 対象 | 結果 |
|---|---|
| Home / consultation、1280px・390px・320px | PASS、横スクロールなし。Homeは1440pxも確認 |
| Heroの文言・改行・CTA | PASS。320pxでもCTAがHero領域内に収まる |
| こんな中高生に / After 8 Weeks / consultation | PC・mobileの実画面で確認。初回positioningを維持 |
| Home CTA → consultation、Projects → FAQ → Home | ブラウザーで遷移を確認 |
| ページ・参照ファイル・内部アンカー | 同一originの21 URLをHTTP検査。リンク切れなし。未知のURLは404 |
| noindex,nofollow | 5 HTMLページのmeta＋実HTTPヘッダーで確認 |
| フォーム確認→申込シミュレーション | 320pxで実行。「実際の送信はしていません」と表示。予約リンクもreview内に留まる |
| 本番送信・本番解析の抑止 | remote配信JSが監査したpayloadとSHA-256一致。endpoint空・review分岐・解析stub・CSPで抑止。実フォームへのPOSTは行っていない |
| ブラウザーconsole | 検証時のwarn/errorなし |
| sourceの必須チェック | SEO、production-audit、同意/attribution等の合成DOM30項目PASS |

再実行：`python verify-remote-preview.py https://3e171ee3.project-mentoring.pages.dev`（GETのみ）。検査記録：[HTTP](review-artifacts/20260925/http-checks.json)、[ブラウザー](review-artifacts/20260925/browser-checks.json)。

本番不変をCloudflare APIの前後比較で確認：canonical deployment `6ee5f50c-2068-4f26-9d7f-85f86ce632b1`、production branch `main`、domains、deployment configのSHA-256が一致。GitHub production mainも `97e6626eca948a14c66d48fafb91264c34979692` のまま。新deploymentはAPI上もenvironment=`preview`、branch=`review-lp-positioning-20260925`。

レビューを妨げる既知の不具合はなし。相談増加・成約効果は未検証。フォーム送信・日時予約・本番計測の稼働確認はこのreview環境の目的外で、意図的に無効。明示承認までproduction merge/deployは行わない。

## Remote screenshots

### Home desktop / mobile

![Home desktop](review-artifacts/20260925/home-desktop.png)

![Home mobile](review-artifacts/20260925/home-mobile.png)

### Consultation desktop / mobile

![Consultation desktop](review-artifacts/20260925/consultation-desktop.png)

![Consultation mobile](review-artifacts/20260925/consultation-mobile.png)

### 320px・各セクション・フォーム

- [Home 320px](review-artifacts/20260925/home-320.png)
- [Consultation 320px](review-artifacts/20260925/consultation-320.png)
- [対象 desktop](review-artifacts/20260925/home-desktop-audience.png) / [mobile](review-artifacts/20260925/home-mobile-audience.png)
- [After 8 Weeks desktop](review-artifacts/20260925/home-desktop-outcome.png) / [mobile](review-artifacts/20260925/home-mobile-outcome.png)
- [フォーム確認](review-artifacts/20260925/form-confirm-320.png) / [シミュレーション完了](review-artifacts/20260925/form-complete-320.png)
