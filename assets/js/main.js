document.addEventListener('DOMContentLoaded', function () {
  const input = document.querySelector('[data-help-search]');
  if (!input) return;
  const cards = Array.from(document.querySelectorAll('[data-help-card]'));
  const empty = document.querySelector('[data-search-empty]');
  input.addEventListener('input', function () {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(function (card) {
      const haystack = (card.getAttribute('data-keywords') || '') + ' ' + card.textContent;
      const visible = !q || haystack.toLowerCase().includes(q);
      card.style.display = visible ? '' : 'none';
      if (visible) shown += 1;
    });
    if (empty) empty.style.display = shown ? 'none' : 'block';
  });
});
