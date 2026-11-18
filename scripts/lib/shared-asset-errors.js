/**
 * The shared ecosystem strip is loaded cross-origin from COSYlanguages. jsdom cannot fetch it
 * offline, so its two assets always report load failures; those are not page script errors.
 */
const SHARED_ASSET_RE = /cosylanguages\.github\.io\/COSYlanguages\/(?:css|js)\/ecosystem-strip\.(?:css|js)/;
const pageErrors = list => list.filter(message => !SHARED_ASSET_RE.test(String(message)));

module.exports = { pageErrors, SHARED_ASSET_RE };
