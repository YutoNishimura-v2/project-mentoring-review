(() => {
  'use strict';
  const config = window.MENTORING_CONFIG?.analytics || {};
  const id = config.measurementId;
  const eligible = config.enabled === true && config.environment === 'production' && /^G-[A-Z0-9]{10}$/.test(id || '') && location.protocol === 'https:' && location.hostname === config.hostname && !/(^localhost$|\.chatgpt\.site$|\.pages\.dev$|\.test$|\.invalid$)/.test(location.hostname);
  const banner = document.querySelector('#analytics-consent');
  const settingsButtons = [...document.querySelectorAll('[data-analytics-settings]')];
  const disclosure = document.querySelector('#analytics-disclosure');
  const acceptedIds = new Set();
  let granted = false, advertising = false, initialized = false, pageViewed = false, opener = null;
  const storageKey = 'pm_analytics_consent_v1';
  const attributionKey = 'pm_attribution_v1';
  const attributionFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  const consentState = () => ({ ...denied, analytics_storage: granted ? 'granted' : 'denied', ad_storage: advertising ? 'granted' : 'denied', ad_user_data: advertising ? 'granted' : 'denied' });
  function gtag() { window.dataLayer.push(arguments); }
  const analyticsOff = () => { window[`ga-disable-${id}`] = true; };
  function cleanAttributionValue(value) {
    if (typeof value !== 'string') return '';
    const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 120);
    // Campaign labels should never be used to carry an email address.
    return cleaned && !cleaned.includes('@') ? cleaned : '';
  }
  function clearAttribution() {
    try { sessionStorage.removeItem(attributionKey); } catch { /* Session storage is optional. */ }
  }
  function captureAttribution() {
    if (!eligible || !granted) return;
    try {
      if (sessionStorage.getItem(attributionKey)) return;
      const landingPath = typeof location.pathname === 'string' && location.pathname.startsWith('/')
        ? location.pathname.slice(0, 200)
        : '/';
      const record = { landing_path: landingPath || '/' };
      const query = new URLSearchParams(location.search);
      for (const key of attributionFields) {
        const value = cleanAttributionValue(query.get(key));
        if (value) record[key] = value;
      }
      sessionStorage.setItem(attributionKey, JSON.stringify(record));
    } catch { /* Attribution must never affect navigation or consultation. */ }
  }
  function formAttribution() {
    if (!eligible || !granted) return null;
    captureAttribution();
    try {
      const saved = JSON.parse(sessionStorage.getItem(attributionKey));
      if (!saved || typeof saved !== 'object') return null;
      const result = { landing_path: cleanAttributionValue(saved.landing_path) || '/' };
      for (const key of attributionFields) {
        const value = cleanAttributionValue(saved[key]);
        if (value) result[key] = value;
      }
      return result;
    } catch { return null; }
  }
  window.MentoringAnalytics = Object.freeze({
    // The request ID is a memory-only deduplication key. Never send it to GA4.
    leadAccepted(requestId) {
      if (typeof requestId !== 'string' || acceptedIds.has(requestId)) return;
      acceptedIds.add(requestId);
      event('generate_lead');
    },
    bookingLinkClick(position) {
      if (position !== 'form_success') return;
      event('booking_link_click', { link_position: position });
    },
    formAttribution,
  });
  if (!eligible) return;
  analyticsOff();
  disclosure.textContent = '「解析のみ許可する」では、Google Analyticsでページの閲覧・相談ボタン・予約ページへのリンク・フォームの送信受理を計測します。「すべて許可する」では、さらに広告クリックの識別情報と相談の送信受理をGoogle広告での効果測定に利用します。広告のパーソナライズには利用しません。氏名・メールアドレス・学年・相談内容・受付番号は、これらの計測へ送りません。同意時のみ、UTMと最初に開いたページを相談の流入確認のため送信内容へ付加します。広告クリックIDは付加しません。選択はブラウザに180日間保存します。拒否しても無料相談をお申し込みいただけます。ページ下部の「Cookie設定」からいつでも変更できます。';
  settingsButtons.forEach(button => { button.hidden = false; });

  // Only explicitly named campaign values are accepted. Never forward free-form URL queries.
  function pageLocation() {
    const safe = new URL(location.pathname || '/', config.siteUrl);
    const query = new URLSearchParams(location.search);
    const allowed = { utm_source: ['google'], utm_medium: ['cpc'], utm_campaign: ['pm_search_01'], utm_content: ['ai_project', 'programming'] };
    for (const [key, values] of Object.entries(allowed)) if (values.includes(query.get(key))) safe.searchParams.set(key, query.get(key));
    for (const key of (advertising ? ['gclid', 'gbraid', 'wbraid'] : [])) {
      const value = query.get(key);
      if (value && /^[A-Za-z0-9_-]{20,200}$/.test(value)) safe.searchParams.set(key, value);
    }
    return safe.href;
  }
  function event(name, extra = {}) {
    if (!eligible || !granted || !initialized) return;
    try {
      gtag('event', name, { send_to: id, page_location: pageLocation(), page_referrer: '', page_title: document.title, ...extra });
    } catch { /* Analytics must never affect consultation. */ }
  }
  function start() {
    window[`ga-disable-${id}`] = false;
    if (!initialized) {
      window.dataLayer = window.dataLayer || [];
      // Basic consent: no Google resource is requested until this function is called after consent.
      gtag('consent', 'default', denied);
      gtag('consent', 'update', consentState());
      gtag('set', { ads_data_redaction: true, url_passthrough: false });
      gtag('js', new Date());
      gtag('config', id, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: pageLocation(), page_referrer: '',
        page_title: document.title,
        cookie_domain: 'none', cookie_expires: 15552000, cookie_update: false,
      });
      const script = document.createElement('script');
      script.id = 'mentoring-google-tag'; script.async = true;
      script.referrerPolicy = 'no-referrer';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      script.onerror = () => { /* No UI dependency on analytics loading. */ };
      document.head.append(script);
      initialized = true;
    } else {
      gtag('consent', 'update', consentState());
    }
    if (!pageViewed) { pageViewed = true; event('page_view'); }
  }
  function clearMeasurementCookies(analyticsToo) {
    for (const item of document.cookie.split(';')) {
      const name = item.trim().split('=')[0];
      if (!/^_gcl_/.test(name) && !(analyticsToo && /^_ga($|_)/.test(name))) continue;
      // Remove only this site's measurement cookies, including domain-scoped variants.
      for (const scope of ['', `; Domain=${config.hostname}`, `; Domain=.${config.hostname}`]) {
        document.cookie = `${name}=; Max-Age=0; Path=/; Secure; SameSite=Lax${scope}`;
      }
    }
  }
  function remember(choice) {
    try { localStorage.setItem(storageKey, JSON.stringify({ choice, expires: Date.now() + lifetime })); } catch { /* Choice still applies for this page. */ }
  }
  function savedChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey));
      if (value && value.expires > Date.now() && ['analytics_ads', 'analytics', 'granted', 'denied'].includes(value.choice)) {
        // Legacy consent was analytics-only. Never silently upgrade or extend it.
        return value.choice === 'granted' ? 'analytics' : value.choice;
      }
    } catch { /* Storage is optional. */ }
    return null;
  }
  function select(choice, persist = true) {
    if (!['analytics_ads', 'analytics', 'denied'].includes(choice)) choice = 'denied';
    granted = choice !== 'denied';
    advertising = choice === 'analytics_ads';
    if (!advertising) clearMeasurementCookies(!granted);
    if (persist) remember(choice);
    if (granted) {
      try { captureAttribution(); start(); } catch { analyticsOff(); }
    } else {
      // Disable transmission before updating consent, including on a later withdrawal.
      analyticsOff();
      if (initialized) { try { gtag('consent', 'update', denied); } catch {} }
      clearMeasurementCookies(true);
      clearAttribution();
    }
    banner.hidden = true;
    if (opener?.isConnected) opener.focus();
    opener = null;
  }
  banner.querySelectorAll('[data-consent-choice]').forEach(button => button.addEventListener('click', () => select(button.dataset.consentChoice)));
  settingsButtons.forEach(button => button.addEventListener('click', () => {
    opener = button; banner.hidden = false;
    document.querySelector('#analytics-consent-title').focus({ preventScroll: true });
  }));
  document.querySelectorAll('[data-consultation-position]').forEach(link => link.addEventListener('click', () => {
    const position = link.dataset.consultationPosition;
    if (['header', 'mobile_nav', 'hero', 'projects', 'price', 'footer'].includes(position)) event('consultation_click', { cta_position: position });
  }));
  document.querySelectorAll('[data-booking-position]').forEach(link => link.addEventListener('click', () => {
    window.MentoringAnalytics.bookingLinkClick(link.dataset.bookingPosition);
  }));
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      const choice = savedChoice();
      select(choice || 'denied', false);
      if (!choice) banner.hidden = false;
    }
  });
  const saved = savedChoice();
  if (saved) select(saved, false);
  else banner.hidden = false;
})();
