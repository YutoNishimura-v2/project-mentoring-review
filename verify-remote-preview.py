"""Read-only HTTP verification of the deployed review payload (never submits)."""
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import urljoin, urlparse
from html.parser import HTMLParser
from urllib.error import HTTPError
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parent
BASE = sys.argv[1].rstrip('/') + '/'
HOST = urlparse(BASE).netloc
assert HOST.endswith('.project-mentoring.pages.dev')

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids, self.robots = [], set(), None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'meta' and attrs.get('name') == 'robots':
            self.robots = attrs.get('content')
        for key in ('href', 'src'):
            if key in attrs:
                self.refs.append(attrs[key])
        if 'srcset' in attrs:
            self.refs.extend(s.strip().split()[0] for s in attrs['srcset'].split(','))
        if tag == 'meta' and attrs.get('property') == 'og:image':
            self.refs.append(attrs['content'])

def read(path):
    url = urljoin(BASE, path)
    assert urlparse(url).netloc == HOST
    try:
        response = urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0 ProjectMentoringReviewCheck/1.0'}), timeout=30)
    except HTTPError as error:
        response = error
    return response.status, dict(response.headers), response.read()

pages, evidence, resources = {}, [], set()
for path in ('/', '/consultation', '/projects', '/faq', '/404'):
    status, headers, body = read(path)
    expected = 200
    assert status == expected, (path, status)
    headers = {key.lower(): value for key, value in headers.items()}
    assert 'noindex' in headers['x-robots-tag'] and 'nofollow' in headers['x-robots-tag']
    assert "connect-src 'none'" in headers['content-security-policy']
    assert "form-action 'none'" in headers['content-security-policy']
    html = body.decode()
    assert 'googletagmanager' not in html and 'google-analytics' not in html
    parser = Page()
    parser.feed(html)
    assert parser.robots == 'noindex,nofollow'
    assert 'review-environment' in parser.ids
    pages[path] = parser
    evidence.append({'path': path, 'status': status, 'robots': parser.robots,
                     'x_robots_tag': headers['x-robots-tag'], 'csp': headers['content-security-policy']})
    for ref in parser.refs:
        url = urlparse(urljoin(BASE.rstrip('/') + path, ref))
        if url.netloc == HOST:
            resources.add(url.path + ('?' + url.query if url.query else ''))
        elif url.scheme in ('http', 'https'):
            assert url.netloc == 'jp.linkedin.com' or ref in ('https://formsubmit.co/privacy.pdf', 'https://policies.google.com/privacy?hl=ja'), ref

for path, page in pages.items():
    for ref in page.refs:
        url = urlparse(urljoin(BASE.rstrip('/') + path, ref))
        if url.netloc != HOST or not url.fragment:
            continue
        target = pages.get(url.path or '/')
        assert target, ref
        assert url.fragment in target.ids or url.fragment + '-dialog' in target.ids, ref

for path in sorted(resources):
    if path.split('?')[0] in pages:
        continue
    status, headers, body = read(path)
    assert status == 200, (path, status)

_, _, config = read('/site-settings.js')
assert read('/review-missing-check')[0] == 404
assert b'"reviewOnly": true' in config and b'"endpoint": ""' in config
assert b'"enabled": false' in config and b'"measurementId": ""' in config
for name in ('script.js', 'analytics.js', 'site-settings.js'):
    _, _, remote = read('/' + name)
    local = (ROOT / 'remote-preview' / name).read_bytes()
    assert hashlib.sha256(remote).digest() == hashlib.sha256(local).digest(), name
script = (ROOT / 'remote-preview/script.js').read_text(encoding='utf-8')
assert script.index('if (reviewOnly) {') < script.index('await fetch(endpoint')
assert 'return;' in script[script.index('if (reviewOnly) {'):script.index('await fetch(endpoint')]
_, _, home = read('/')
assert '海外大学や総合型選抜も視野に、<br>自分の興味を深めたい中高生へ。' in home.decode()
result = {'base': BASE, 'pages': evidence, 'same_origin_resources_checked': len(resources),
          'broken_internal_links': 0, 'remote_scripts_match_audited_payload': True,
          'review_form_endpoint': 'empty', 'analytics': 'disabled; no measurement ID; inert script',
          'method': 'GET only; no form submission or external destination requested', 'result': 'PASS'}
out = ROOT / 'review-artifacts/20260925/http-checks.json'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(result, ensure_ascii=False, indent=2))
