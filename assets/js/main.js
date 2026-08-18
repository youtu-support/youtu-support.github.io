(function () {
  'use strict';

  /* ========================================
     Google Analytics 4
     Measurement ID: G-DZRC8XEJ5Y
     ======================================== */

  const GA_MEASUREMENT_ID = 'G-DZRC8XEJ5Y';

  function loadGoogleAnalytics() {
    if (!GA_MEASUREMENT_ID) return;

    /* 避免重复加载 */
    if (window.__youtuGaLoaded) return;
    window.__youtuGaLoaded = true;

    /* 初始化 dataLayer */
    window.dataLayer = window.dataLayer || [];

    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    /* 动态加载 Google gtag.js */
    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA_MEASUREMENT_ID);

    document.head.appendChild(script);

    /* 初始化 GA4 */
    window.gtag('js', new Date());

    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true
    });
  }

  /* 页面开始加载时初始化 GA4 */
  loadGoogleAnalytics();

  /* ========================================
     首页帮助内容搜索
     ======================================== */

  document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('[data-help-search]');

    if (!input) return;

    const cards = Array.from(
      document.querySelectorAll('[data-help-card]')
    );

    const empty = document.querySelector('[data-search-empty]');

    input.addEventListener('input', function () {
      const q = input.value.trim().toLowerCase();

      let shown = 0;

      cards.forEach(function (card) {
        const keywords =
          card.getAttribute('data-keywords') || '';

        const haystack =
          keywords + ' ' + card.textContent;

        const visible =
          !q || haystack.toLowerCase().includes(q);

        card.style.display = visible ? '' : 'none';

        if (visible) {
          shown += 1;
        }
      });

      if (empty) {
        empty.style.display =
          shown > 0 ? 'none' : 'block';
      }
    });
  });
})();
