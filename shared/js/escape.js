/**
 * HTML escaping helpers for safely building markup from data or URL parameters.
 * Works as a classic <script> (sets window.COSYEscape) and in Node (module.exports).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.COSYEscape = api;
})(typeof self !== 'undefined' ? self : this, function () {
  const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Escape a value for use in HTML text or a quoted attribute. null/undefined become ''. */
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => MAP[ch]);
  }

  /**
   * Tagged template: html`<b>${userInput}</b>` escapes every interpolation.
   * Wrap already-safe markup with raw() to opt out.
   */
  function html(strings, ...values) {
    return strings.reduce((out, s, i) => {
      if (i >= values.length) return out + s;
      const v = values[i];
      return out + s + (v && v.__rawHtml !== undefined ? v.__rawHtml : escapeHtml(v));
    }, '');
  }

  /** Mark a string as trusted markup for the html tag. Never pass user input here. */
  function raw(markup) {
    return { __rawHtml: String(markup) };
  }

  return { escapeHtml, html, raw };
});
