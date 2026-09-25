"""Build an isolated, static Cloudflare Pages review payload; never deploys."""
from pathlib import Path
import json
import re
import shutil

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'site-preview'
OUTPUT = ROOT / 'remote-preview'
OUTPUT.mkdir(exist_ok=True)
BASE = '/project-mentoring-review/site-preview'
ALIAS = 'https://review-lp-positioning-202609.project-mentoring.pages.dev/'
BANNER = '<aside id="review-environment" class="review-banner" aria-label="レビュー環境">REVIEW PREVIEW — 確認用 / 申込送信・アクセス解析は無効です</aside>'

for name in ['index.html', 'consultation.html', 'projects.html', 'faq.html', '404.html']:
    html = (SOURCE / name).read_text(encoding='utf-8')
    html = html.replace(BASE + '/index.html', '/').replace(BASE + '/', '/')
    for page in ['consultation', 'projects', 'faq']:
        html = html.replace(f'href="/{page}.html', f'href="/{page}')
    html = re.sub(r'(<body\b[^>]*>)', r'\1\n' + BANNER, html, count=1)
    html = html.replace('</head>', '  <link rel="stylesheet" href="/review.css">\n</head>')
    html = re.sub(r'<link rel="canonical" href="[^"]+">', '', html)
    html = html.replace('https://project-mentoring.com/assets/', '/assets/')
    html = html.replace('https://project-mentoring.com/', ALIAS)
    # Social image metadata must use an absolute URL on the review origin.
    html = html.replace('property="og:image" content="/assets/', 'property="og:image" content="' + ALIAS + 'assets/')
    html = html.replace('name="twitter:image" content="/assets/', 'name="twitter:image" content="' + ALIAS + 'assets/')
    html = html.replace('href="https://calendar.app.google/zDMqNh2eyVPjtzSW6"', 'href="#review-environment"')
    html = html.replace('Google予約ページで日時を選ぶ', 'レビュー版では予約に進みません')
    html = html.replace('target="_blank" rel="noopener noreferrer" data-booking-position', 'data-booking-position')
    assert 'content="noindex,nofollow"' in html, name
    (OUTPUT / name).write_text(html, encoding='utf-8')

for name in ['site.css', 'consent.css', 'script.js']:
    shutil.copyfile(SOURCE / name, OUTPUT / name)
script_path = OUTPUT / 'script.js'
script = script_path.read_text(encoding='utf-8')
script = script.replace('このまま日時選択後の画面を確認できます。ご連絡先：', '予約ページへの移動も無効です。入力したメールアドレス：')
script_path.write_text(script, encoding='utf-8')
shutil.copytree(SOURCE / 'assets', OUTPUT / 'assets', dirs_exist_ok=True)
config = {
    'endpoint': '', 'reviewOnly': True, 'formUrl': ALIAS,
    'privacyContact': 'yutonishimurav20512@gmail.com',
    'processorDisclosure': 'レビュー版です。入力内容は外部へ送信されません。',
    'analytics': {'enabled': False, 'measurementId': '', 'environment': 'review', 'siteUrl': ALIAS}
}
(OUTPUT / 'site-settings.js').write_text('window.MENTORING_CONFIG = Object.freeze(' + json.dumps(config, ensure_ascii=False, indent=2) + ');\n', encoding='utf-8')
(OUTPUT / 'analytics.js').write_text("// Review only: no analytics library or network request.\nwindow.MentoringAnalytics = Object.freeze({leadAccepted() {}, formAttribution() { return null; }});\n", encoding='utf-8')
(OUTPUT / 'review.css').write_text('.review-banner { padding: 8px 14px; background: #fff3f1; border-bottom: 1px solid #deded9; color: #8c2825; font-size: 12px; line-height: 1.6; text-align: center; overflow-wrap: anywhere; }\n', encoding='utf-8')
(OUTPUT / '_headers').write_text("/*\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; form-action 'none'; object-src 'none'; base-uri 'self'\n", encoding='utf-8')
# Do not block crawling in robots.txt: crawlers must see the noindex response.
(OUTPUT / 'robots.txt').write_text('User-agent: *\nAllow: /\n', encoding='utf-8')
script = (OUTPUT / 'script.js').read_text(encoding='utf-8')
assert script.index('if (reviewOnly) {') < script.index('await fetch(endpoint')
for p in OUTPUT.rglob('*'):
    if p.is_file():
        assert p.suffix.lower() not in ['.toml', '.pem', '.key', '.env', '.map']
        if p.suffix.lower() in ['.js', '.html', '.css']:
            text = p.read_text(encoding='utf-8')
            assert not re.search(r'G-[A-Z0-9]{10}|AW-\d{6,}|https://formsubmit\.co/ajax/[a-f0-9]{32}|oauth_token|refresh_token|BEGIN PRIVATE KEY', text), p.name
print(f'Review payload ready: {OUTPUT}')
