/**
 * js/core/i18n.js
 * Language detection and UI localization system based on JSON string files.
 * Adheres to the "No-Translation" immersion principle: content is exclusively
 * target-language based, no fallback to English permitted.
 */

(function() {
    'use strict';

    let currentLang = null;
    let translations = {};

    /**
     * Determines the current language based on the environment.
     * localStorage wins, otherwise fallback to path/URL, otherwise 'en'.
     */
    function detectLanguage() {
        const stored = localStorage.getItem('cosy_last_language');
        if (stored) return stored.toLowerCase();

        const path = window.location.pathname;

        // Rule 1: URL path determines language (e.g., /languages/el/)
        const langMatch = path.match(/\/languages\/([a-z]{2})\//);
        if (langMatch) return langMatch[1].toLowerCase();

        // Fallback to English
        return 'en';
    }

    /**
     * Fetches the UI strings JSON for a given language.
     */
    async function fetchTranslations(lang) {
        if (!lang) return {};

        const prefix = (window.COSY && typeof window.COSY.getPrefix === 'function')
            ? window.COSY.getPrefix()
            : '/';

        try {
            const response = await fetch(`${prefix}data/ui/${lang}.json?v=${Date.now()}`);
            if (!response.ok) throw new Error(`Could not load ${lang}.json`);
            return await response.json();
        } catch (e) {
            console.warn(`[i18n] Failed to load UI strings for ${lang}`, e);
            return {};
        }
    }


    /**
     * Translates a key using the currently loaded strings.
     * Supports nested keys (e.g., "nav.home").
     */
    window.t = function(key) {
        if (!key) return '';

        // Try literal match first
        if (translations[key]) return translations[key];

        // Try nested match
        const parts = key.split('.');
        let val = translations;
        for (const part of parts) {
            if (val && typeof val === 'object' && part in val) {
                val = val[part];
            } else {
                return ''; // No-Translation Rule: leave blank if missing
            }
        }
        return typeof val === 'string' ? val : '';
    };

    /**
     * Applies translations to all elements with data-translate-key.
     */
    function applyTranslations() {
        if (!currentLang) return; // Safety check
        if (!translations || Object.keys(translations).length === 0) return; // Safety check

        const elements = document.querySelectorAll('[data-translate-key]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate-key');
            const translation = window.t(key);

            // Immersion rule: if key is missing, it becomes blank (or stays blank)
            // if we are in a specific language mode.
            if (translation || el.hasAttribute('data-immersion-strict')) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.hasAttribute('placeholder')) el.setAttribute('placeholder', translation);
                    else el.value = translation;
                } else if (el.tagName === 'META') {
                    el.setAttribute('content', translation);
                } else if (el.tagName === 'TITLE') {
                    if (translation) document.title = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });
    }

    /**
     * Public setLanguage for manual switching.
     */
    let inSyncChange = false;
    window.setLanguage = async function(lang) {
        if (!lang) return;
        if (inSyncChange) return;
        inSyncChange = true;
        try {
            currentLang = lang.toLowerCase();
            localStorage.setItem('cosy_last_language', currentLang);
            translations = await fetchTranslations(currentLang);
            applyTranslations();

            if (window.setUILanguage) {
                await window.setUILanguage(currentLang);
            }

            // Refresh navbar/mobile menu/etc. to update lang pickers & menus
            if (window.COSY && typeof window.COSY.refresh === 'function') {
                window.COSY.refresh();
            }

            document.dispatchEvent(new CustomEvent('cosyLanguageChanged', { detail: { lang: currentLang } }));
        } finally {
            inSyncChange = false;
        }
    };

    /**
     * Initializes the i18n system.
     */
    async function initI18n() {
        currentLang = detectLanguage();

        // Dynamically load the new UI i18n loader (js/i18n.js) using robust fallback path detector
        let prefix = '/';
        if (window.COSY && typeof window.COSY.getPrefix === 'function') {
            prefix = window.COSY.getPrefix();
        } else {
            let relativePath = window.location.pathname;
            if (relativePath.startsWith('/COSYlanguages/')) {
                relativePath = relativePath.substring('/COSYlanguages/'.length);
            } else if (relativePath.startsWith('/COSYlanguages')) {
                relativePath = relativePath.substring('/COSYlanguages'.length);
            } else if (relativePath.startsWith('/')) {
                relativePath = relativePath.substring(1);
            }
            const segments = relativePath.split('/').filter(Boolean);
            if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
                segments.pop();
            }
            const depth = segments.length;
            prefix = depth > 0 ? '../'.repeat(depth) : './';
        }

        const uiScript = document.createElement('script');
        uiScript.src = prefix + 'js/i18n.js';
        document.head.appendChild(uiScript);

        if (currentLang) {
            localStorage.setItem('cosy_last_language', currentLang);
            translations = await fetchTranslations(currentLang);
            applyTranslations();

            // Refresh navbar/mobile menu/etc. if engine is already loaded
            if (window.COSY && typeof window.COSY.refresh === 'function') {
                window.COSY.refresh();
            }
        }

        document.dispatchEvent(new CustomEvent('cosyI18nReady', { detail: { lang: currentLang } }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }

    // Expose internal state for debugging/engine
    window.COSY_I18N = {
        get currentLang() { return currentLang; },
        get translations() { return translations; },
        refresh: applyTranslations
    };
})();
