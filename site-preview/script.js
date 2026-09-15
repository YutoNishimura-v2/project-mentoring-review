(() => {
  'use strict';
  const config = window.MENTORING_CONFIG || {};
  const endpoint = typeof config.endpoint === 'string' ? config.endpoint.trim() : '';
  const reviewOnly = config.reviewOnly === true;
  const canSend = reviewOnly || (/^https:\/\/formsubmit\.co\/ajax\/[a-f0-9]{32}$/.test(endpoint) && Boolean(config.privacyContact && config.processorDisclosure));
  const form = document.querySelector('#consultation-form');
  const review = document.querySelector('#review-dialog');
  const privacy = document.querySelector('#privacy-dialog');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  document.querySelectorAll('.page-mobile-menu').forEach((details) => {
    const summary = details.querySelector('summary');
    if (!summary) return;
    const updateLabel = () => {
      const label = details.open ? '閉じる ×' : 'メニュー';
      summary.textContent = label;
      summary.setAttribute('aria-label', details.open ? 'メニューを閉じる' : 'メニューを開く');
    };
    details.addEventListener('toggle', updateLabel);
    updateLabel();
  });
  const sendButton = document.querySelector('#send-consultation');
  const reviewHeading = document.querySelector('#review-title');
  const reviewFields = document.querySelector('#review-fields');
  const reviewNotice = document.querySelector('#review-notice');
  const returnButton = document.querySelector('#review-return');
  const fallbacks = [...document.querySelectorAll('[data-send-fallback]')];
  let pending = null;
  let inFlight = false;

  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'メニューを開く');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width:1001px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const terms = document.querySelector('#terms-dialog');
  const openTerms = () => { if (terms && !terms.open) terms.showModal(); };
  const openLinkedTerms = () => { if (window.location.hash === '#terms') openTerms(); };
  const openLinkedPrivacy = () => { if (privacy && window.location.hash === '#privacy' && !privacy.open) privacy.showModal(); };
  document.querySelectorAll('[data-terms]').forEach(link => link.addEventListener('click', e => { e.preventDefault(); openTerms(); }));
  window.addEventListener('hashchange', openLinkedTerms);
  window.addEventListener('hashchange', openLinkedPrivacy);
  openLinkedTerms();
  openLinkedPrivacy();
  document.querySelectorAll('[data-privacy]').forEach(button => button.addEventListener('click', () => privacy?.showModal()));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', e => {
      const rect = dialog.getBoundingClientRect();
      if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) dialog.close();
    });
  });
  if (form && canSend) {
    document.querySelector('#privacy-storage').textContent = config.processorDisclosure;
  }

  if (typeof config.privacyContact === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.privacyContact)) {
    document.querySelectorAll('[data-contact-email]').forEach(link => {
      link.textContent = config.privacyContact;
      link.href = `mailto:${config.privacyContact}`;
    });
  }

  if (form && !canSend) document.querySelector('#form-availability').textContent = '現在、オンライン受付の準備中です。';

  // The form lives only on /consultation. Shared navigation and legal dialogs
  // remain available on the home page without initializing form-only controls.
  if (!form) return;

  function validate() {
    const errors = [];
    ['parent-name', 'grade', 'email', 'privacy-consent'].forEach(id => {
      const input = document.getElementById(id);
      let message = '';
      if (id === 'parent-name' && !input.value.trim()) message = '保護者のお名前を入力してください。';
      if (id === 'grade' && !input.value) message = '学年を選択してください。';
      if (id === 'email' && (!input.value.trim() || !input.validity.valid)) message = '有効なメールアドレスを入力してください。';
      if (id === 'privacy-consent' && !input.checked) message = '個人情報の取り扱いをご確認ください。';
      document.getElementById(`${id}-error`).textContent = message;
      if (message) { input.setAttribute('aria-invalid', 'true'); errors.push(input); }
      else input.removeAttribute('aria-invalid');
    });
    if (errors.length) errors[0].focus();
    return errors.length === 0;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (inFlight || !validate()) return;
    if (form.elements.website.value) return;
    pending = {
      parentName: form.elements.parentName.value.trim(),
      grade: form.elements.grade.value,
      email: form.elements.email.value.trim(),
      interest: form.elements.interest.value.trim(),
      consent: true,
      requestId: window.crypto.randomUUID(),
      honey: form.elements.website.value,
    };
    review.classList.remove('is-complete');
    reviewHeading.textContent = '入力内容の確認';
    reviewFields.hidden = false;
    sendButton.hidden = false;
    returnButton.className = 'text-link';
    returnButton.textContent = '入力に戻る';
    fallbacks.forEach(item => { item.hidden = true; });
    document.querySelector('#form-status').textContent = '';
    const fields = reviewFields;
    fields.replaceChildren();
    [['保護者のお名前', pending.parentName], ['学年', pending.grade], ['メールアドレス', pending.email], ['相談したいこと', pending.interest || '記入なし']].forEach(([label, value]) => {
      const dt = document.createElement('dt'); const dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = value; fields.append(dt, dd);
    });
    document.querySelector('#send-status').textContent = '';
    document.querySelector('#review-notice').textContent = canSend ? '保護者向け無料相談（20分・オンライン）を申し込みます。有料指導の内容・料金のご案内と、適している場合の受講提案を含みます。有料受講の申込みではありません。日程はメールで調整します。' : '現在はオンライン受付の準備中です。入力内容は送信されず、お申し込みは完了しません。';
    sendButton.disabled = !canSend;
    sendButton.textContent = canSend ? 'この内容で申し込む' : '受付準備中';
    review.showModal();
    review.scrollTop = 0;
  });

  sendButton.addEventListener('click', async () => {
    if (reviewOnly) {
      document.querySelector('#send-status').textContent = 'レビュー版のため、入力内容は送信されません。';
      sendButton.textContent = 'レビュー版では送信しません';
      sendButton.disabled = true;
      return;
    }
    if (!canSend || !pending || inFlight) return;
    inFlight = true; sendButton.disabled = true; sendButton.textContent = '送信しています…';
    const formControls = [...form.elements];
    formControls.forEach(control => { control.disabled = true; });
    document.querySelector('#form-status').textContent = '送信しています…';
    const status = document.querySelector('#send-status');
    status.textContent = '';
    returnButton.disabled = true;
    fallbacks.forEach(item => { item.hidden = true; });
    const payload = {
      name: pending.parentName,
      email: pending.email,
      'お子さまの学年': pending.grade,
      '相談したいこと': pending.interest || '記入なし',
      '個人情報の取り扱い': '同意済み',
      '受付番号': pending.requestId,
      _subject: '【PROJECT MENTORING】無料相談のお申し込み',
      _template: 'table',
      _url: config.formUrl,
      _honey: pending.honey,
    };
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload), credentials: 'omit', signal: controller.signal });
      let result;
      try { result = await response.json(); } catch { throw new Error('Invalid acknowledgement'); }
      if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Request not confirmed');
      review.classList.add('is-complete');
      reviewHeading.textContent = '無料相談を受け付けました';
      reviewFields.hidden = true;
      const receiptEmail = document.createElement('strong');
      receiptEmail.className = 'receipt-email';
      receiptEmail.textContent = pending.email;
      reviewNotice.replaceChildren(document.createTextNode('日程調整のご連絡は、次のメールアドレスへお送りします。'), receiptEmail);
      status.textContent = '';
      sendButton.hidden = true;
      sendButton.textContent = '受付完了';
      returnButton.className = 'button';
      returnButton.textContent = '閉じる';
      document.querySelector('#form-status').textContent = '無料相談を受け付けました。ご入力のメールアドレスへ、日程調整のご連絡をいたします。';
      try { window.MentoringAnalytics?.leadAccepted(pending.requestId); } catch { /* Tracking cannot turn a received request into an error. */ }
      pending = null; form.reset();
      review.scrollTop = 0;
      if (review.open) reviewHeading.focus();
    } catch (error) {
      status.textContent = error.name === 'AbortError'
        ? '受付状況を確認できませんでした。通信が遅れています。再送すると重複する場合があります。入力内容は保持されています。'
        : '送信の完了を確認できませんでした。時間をおいて再度お試しください。入力内容は保持されています。';
      document.querySelector('#form-status').textContent = '送信の完了を確認できませんでした。入力内容は保持されています。';
      sendButton.textContent = 'もう一度送信する'; sendButton.disabled = false;
      fallbacks.forEach(item => { item.hidden = false; });
    } finally {
      clearTimeout(timeout); inFlight = false;
      returnButton.disabled = false;
      formControls.forEach(control => { control.disabled = false; });
    }
  });
  document.querySelectorAll('.preview-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      document.getElementById(button.getAttribute('aria-controls')).classList.toggle('is-expanded', expanded);
      button.firstChild.textContent = expanded ? '解説の画面を閉じる' : '解説の画面も見る';
      button.querySelector('span').textContent = expanded ? '−' : '＋';
    });
  });
  form.querySelector('[type=submit]').disabled = false;
})();
