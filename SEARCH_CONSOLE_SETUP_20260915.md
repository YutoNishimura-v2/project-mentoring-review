# PROJECT MENTORING — Search Console 設定・インデックス申請結果

実施日：2026年9月15日（JST）  
対象：`project-mentoring.com`

## 結果

| 項目 | 結果 |
|---|---|
| Search Console property登録 | 成功（新規ドメインプロパティ） |
| Domain ownership verification | 成功 |
| DNS TXT追加 | 成功 |
| sitemap.xml送信 | 成功 |
| sitemap検出ページ数 | 6 |
| 主要6 URLのライブテスト | 全URL「Googleに登録できます」 |
| インデックス登録リクエスト | 6 URLすべて受付済み |
| 人間側に残った操作 | なし |

## 所有権確認

- Search Consoleに `project-mentoring.com` をドメインプロパティとして追加した。
- Cloudflareの対象ゾーンが `project-mentoring.com` であることを確認した。
- 追加前のDNSレコードは、ルートドメインからCloudflare Pagesを指すCNAME 1件だった。
- Googleが発行した所有権確認用TXTレコードだけをルートへ追加した。
- 既存のCNAMEその他のレコードは削除・変更していない。
- Search Consoleで「所有権を証明しました」を確認した。
- 設定画面でも「あなたは確認済みの所有者です」と表示されている。

確認状態を維持するため、Googleのverification TXTは削除しない。

## sitemap

送信URL：`https://project-mentoring.com/sitemap.xml`

Search Console表示：

- 種別：サイトマップ
- ステータス：成功しました
- 検出されたページ数：6
- 検出された動画数：0

## URL Inspection

| URL | 送信前の状態 | ライブテスト | クロール | 取得 | index許可 | 指定canonical | リクエスト |
|---|---|---|---|---|---|---|---|
| `https://project-mentoring.com/` | Google未登録 | 登録可能 | 許可 | 成功 | 許可 | 自己参照 | 受付済み |
| `https://project-mentoring.com/ai-project` | Google未登録 | 登録可能 | 許可 | 成功 | 許可 | 自己参照 | 受付済み |
| `https://project-mentoring.com/programming-project` | 検出・未登録 | 登録可能 | 許可 | 成功 | 許可 | 自己参照 | 受付済み |
| `https://project-mentoring.com/inquiry-learning` | 検出・未登録 | 登録可能 | 許可 | 成功 | 許可 | 自己参照 | 受付済み |
| `https://project-mentoring.com/faq` | 検出・未登録 | 登録可能 | 許可 | 成功 | 許可 | 自己参照 | 受付済み |
| `https://project-mentoring.com/consultation` | 検出・未登録 | 登録可能 | 許可 | 成功 | 許可 | 自己参照 | 受付済み |

HOME以外の5ページでは、ライブテストでBreadcrumbListの有効なアイテムも検出された。

Googleが選択するcanonicalは、インデックス登録後に決定されるため現時点では未確定。サイト側が指定したcanonicalは、全6ページで対象URL自身と一致している。

## Google側の表示と判断

- 現時点では全6 URLが未登録。公開直後かつプロパティ新規登録直後の状態であり、異常を示すものではない。
- 各URLはGoogleのスマートフォン検査ツールで取得に成功し、robotsによるクロール制限とnoindexは検出されなかった。
- 設定画面には一時的に「robots.txt ファイルがありません」と表示されている。一方、全URLのライブテストはクロール許可・取得成功で、公開中の `https://project-mentoring.com/robots.txt` もHTTP 200を確認済み。新規プロパティのデータ処理待ちとして経過確認する。
- Search Consoleのサマリー、クロール統計、検索パフォーマンスは「データを処理しています。1日後にもう一度」と表示されている。

## 今後の確認

登録リクエストはクロールを保証せず、反映まで数日以上かかる場合がある。数日後に次を確認する。

1. ページのインデックス登録状況
2. Googleが選択したcanonical
3. sitemapの最終読み込み状態と検出数
4. robots.txtのSearch Console表示
5. 検索パフォーマンスと検索クエリ

同じURLを短期間に繰り返し申請しても優先順位は上がらないため、今回の申請後はGoogleのクロールを待つ。
