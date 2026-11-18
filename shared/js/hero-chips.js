/* COSYtools home: the hero chips apply the matching "Tool type" filter and jump to the results. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('[data-jump-type]') : null;
    if (!chip) return;
    var pill = document.querySelector('[data-filter-type="' + chip.getAttribute('data-jump-type') + '"]');
    if (pill) pill.click();
    var results = document.getElementById('hub-tool-results') || document.getElementById('hub-primary-languages');
    if (results && results.scrollIntoView) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
