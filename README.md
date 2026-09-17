# PROJECT MENTORING — Production-ready design review

更新：2026年9月17日。現在は**本番反映前の外部レビュー版**です。

## レビュー対象

**[サイト全体をブラウザで確認する](https://yutonishimura-v2.github.io/project-mentoring-review/site-preview/)**

- [HOME](https://yutonishimura-v2.github.io/project-mentoring-review/site-preview/)
- [プロジェクト例](https://yutonishimura-v2.github.io/project-mentoring-review/site-preview/projects.html)
- [よくある質問](https://yutonishimura-v2.github.io/project-mentoring-review/site-preview/faq.html)
- [保護者向け無料相談](https://yutonishimura-v2.github.io/project-mentoring-review/site-preview/consultation.html)

## 今回の実装

- 提供されたデザイン参照HTMLを、HOMEのビジュアル・コピー・情報順序の基準として再実装
- 写真上のHero、編集的なWHY、仮説→試行→評価→判断、8週間、指導者、料金、相談CTAを忠実に再現
- プロトタイプの重複CSSは持ち込まず、単一のsite.cssへ整理
- プロジェクト例・FAQ・無料相談ページを同じデザインシステムへ統一
- HOMEと内容が重複していたMethodページを削除。固有だった「不足に気づき、必要なことを学び直す」という説明だけをFAQへ統合
- 既存のFormSubmit、確認画面、Cookie同意、GA4イベント、SEO、構造化データ、法定表示を保持
- 料金は8週間200,000円（税込）、オンライン1対1指導8回

## レビュー版の制限

レビュー版ではアクセス解析と外部フォーム送信を無効にし、全ページをnoindex,nofollowにしています。フォームは入力確認画面まで確認できますが、送信されません。本番project-mentoring.comは今回まだ更新していません。

## 検証

- 4ページの構造・metadata・canonical・価格・sitemap・redirect検査：合格
- Cookie／GA4同意の合成DOMテスト：26項目合格
- JavaScript構文：合格
- 1440／1280／1024／768／430／390pxで全4ページを確認：横方向overflowなし
- 無料相談フォーム：必須入力、学年選択、同意、確認ダイアログまでローカル実動作確認
