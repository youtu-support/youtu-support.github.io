(function () {
  'use strict';

  const GA_MEASUREMENT_ID = 'G-DZRC8XEJ5Y';

  function loadGoogleAnalytics() {
    if (!GA_MEASUREMENT_ID || window.__youtuGaLoaded) return;
    window.__youtuGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }

  loadGoogleAnalytics();

  document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('[data-help-search]');
    if (!input) return;

    const cards = Array.from(document.querySelectorAll('[data-help-card]'));
    const empty = document.querySelector('[data-search-empty]');
    const resultsBox = document.querySelector('[data-search-results]');
    let index = [];

    fetch('/search-index.json', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) { index = Array.isArray(data) ? data : []; })
      .catch(function () { index = []; });

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (ch) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
      });
    }

    function excerpt(text, terms) {
      const lower = text.toLowerCase();
      let pos = -1;
      terms.some(function (t) { pos = lower.indexOf(t); return pos >= 0; });
      if (pos < 0) pos = 0;
      const start = Math.max(0, pos - 45);
      const piece = text.slice(start, start + 125).trim();
      return (start > 0 ? '…' : '') + piece + (start + 125 < text.length ? '…' : '');
    }

    input.addEventListener('input', function () {
      const q = input.value.trim().toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      let shown = 0;

      cards.forEach(function (card) {
        const haystack = ((card.getAttribute('data-keywords') || '') + ' ' + card.textContent).toLowerCase();
        const visible = terms.length === 0 || terms.every(function (term) { return haystack.includes(term); });
        card.style.display = visible ? '' : 'none';
        if (visible) shown += 1;
      });

      if (!terms.length) {
        if (resultsBox) { resultsBox.innerHTML = ''; resultsBox.classList.remove('is-visible'); }
        if (empty) empty.style.display = 'none';
        return;
      }

      const matches = index.filter(function (item) {
        const haystack = (item.title + ' ' + item.text).toLowerCase();
        return terms.every(function (term) { return haystack.includes(term); });
      }).slice(0, 6);

      if (resultsBox) {
        resultsBox.innerHTML = matches.map(function (item) {
          return '<a class="search-result" href="' + escapeHtml(item.url) + '"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(excerpt(item.text, terms)) + '</span></a>';
        }).join('');
        resultsBox.classList.toggle('is-visible', matches.length > 0);
      }

      if (empty) empty.style.display = (shown > 0 || matches.length > 0) ? 'none' : 'block';
    });
  });
})();
