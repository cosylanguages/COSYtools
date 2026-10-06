(function() {
    'use strict';

    /**
     * COSY Ecosystem Cross-Domain Single Sign-On (SSO) Handler
     * Restores user session from URL hash parameters (#access_token=...&refresh_token=...)
     * or shared localStorage across ecosystem subdomains without re-prompting for credentials.
     */

    function getSupabaseClient() {
        if (window.supabaseClient && window.supabaseClient.auth) {
            return window.supabaseClient;
        }
        if (window.supabase && window.supabase.auth) {
            return window.supabase;
        }
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            const url = window.COSY_SUPABASE_URL;
            const anonKey = window.COSY_SUPABASE_ANON_KEY;
            if (url && anonKey) {
                try {
                    window.supabaseClient = window.supabase.createClient(url, anonKey);
                    return window.supabaseClient;
                } catch (e) {
                    console.warn('COSY SSO: Could not create Supabase client', e);
                }
            }
        }
        return null;
    }

    async function restoreSessionFromHash() {
        if (!window.location.hash || !window.location.hash.includes('access_token')) {
            return false;
        }

        const client = getSupabaseClient();
        if (!client || !client.auth) return false;

        try {
            const hashStr = window.location.hash.replace(/^#/, '');
            const params = new URLSearchParams(hashStr);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
                const { data, error } = await client.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

                if (error) {
                    console.warn('COSY SSO: Failed to restore session via setSession:', error.message || error);
                    return false;
                }

                console.log('COSY SSO: Session successfully restored from hash tokens.');
                window.dispatchEvent(new CustomEvent('cosy:auth:changed', { detail: { session: data?.session } }));

                // Seamlessly clean hash fragment from URL bar
                if (window.history && window.history.replaceState) {
                    const cleanUrl = window.location.pathname + window.location.search;
                    window.history.replaceState(null, document.title, cleanUrl);
                } else {
                    window.location.hash = '';
                }
                return true;
            }
        } catch (err) {
            console.error('COSY SSO: Error handling SSO hash fragment:', err);
        }
        return false;
    }

    async function checkExistingSession() {
        const client = getSupabaseClient();
        if (!client || !client.auth) return;

        try {
            let session = null;
            if (typeof client.auth.getSession === 'function') {
                const { data } = await client.auth.getSession();
                session = data?.session;
            } else if (typeof client.auth.session === 'function') {
                session = client.auth.session();
            }

            if (session) {
                window.dispatchEvent(new CustomEvent('cosy:auth:changed', { detail: { session } }));
            }
        } catch (e) {
            console.warn('COSY SSO: Session check notice', e);
        }
    }

    function setupEcosystemLinkInterception() {
        document.addEventListener('click', async function(e) {
            const link = e.target.closest('a[href*="COSY"], a[href*="cosylanguages"]');
            if (!link || !link.href) return;

            // Ignore modified clicks (cmd/ctrl click for new tab)
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            const client = getSupabaseClient();
            if (!client || !client.auth) return;

            e.preventDefault();
            const originalHref = link.href;

            try {
                let session = null;
                if (typeof client.auth.getSession === 'function') {
                    const { data } = await client.auth.getSession();
                    session = data?.session;
                } else if (typeof client.auth.session === 'function') {
                    session = client.auth.session();
                }

                if (session && session.access_token && session.refresh_token) {
                    const targetUrl = new URL(originalHref, window.location.origin);
                    const hashParams = new URLSearchParams(targetUrl.hash.replace(/^#/, ''));
                    hashParams.set('access_token', session.access_token);
                    hashParams.set('refresh_token', session.refresh_token);
                    targetUrl.hash = hashParams.toString();

                    window.location.href = targetUrl.toString();
                    return;
                }
            } catch (err) {
                console.warn('COSY SSO: Link interception notice:', err);
            }

            window.location.href = originalHref;
        }, true);
    }

    async function init() {
        const hashRestored = await restoreSessionFromHash();
        if (!hashRestored) {
            await checkExistingSession();
        }
        setupEcosystemLinkInterception();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.COSY_SSO = {
        getSupabaseClient: getSupabaseClient,
        handleSSOHash: restoreSessionFromHash
    };

})();
