(() => {
  'use strict';
  const banner = document.querySelector('#analytics-consent');
  const settingsButtons = [...document.querySelectorAll('[data-analytics-settings]')];
  if (!banner) return;
  const key = 'pm_review_consent_v1';
  const close = choice => {
    try { localStorage.setItem(key, choice); } catch {}
    banner.hidden = true;
  };
  window.MentoringAnalytics = Object.freeze({ leadAccepted() {} });
  banner.querySelectorAll('[data-consent-choice]').forEach(button => {
    button.addEventListener('click', () => close(button.dataset.consentChoice || 'denied'));
  });
  settingsButtons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      banner.hidden = false;
      document.querySelector('#analytics-consent-title')?.focus({ preventScroll: true });
    });
  });
  let saved = null;
  try { saved = localStorage.getItem(key); } catch {}
  banner.hidden = Boolean(saved);
})();
