/**
 * @file shared/js/types.js
 * Core JSDoc Type Definitions for COSYtools Data Models & Client API Wrappers
 */

/**
 * @typedef {Object} COSYUser
 * @property {string} [id] - Unique user identifier from Supabase auth.
 * @property {string} [email] - User's primary email address.
 * @property {string} [role] - Direct user role ('admin', 'founder', 'owner', 'learner').
 * @property {Object.<string, any>} [user_metadata] - Metadata attached to user identity.
 * @property {Object.<string, any>} [app_metadata] - Application metadata attached to user identity.
 */

/**
 * @typedef {Object} UserSession
 * @property {string} access_token - OAuth / Supabase JWT access token.
 * @property {string} refresh_token - OAuth / Supabase refresh token.
 * @property {COSYUser} [user] - Authenticated user details.
 * @property {number} [expires_at] - Expiration timestamp in seconds.
 */

/**
 * @typedef {Object} UserScore
 * @property {string} user_id - Supabase user ID.
 * @property {string} game_name - Name of tool or exercise engine.
 * @property {number} score - Achieved raw score.
 * @property {number} max_score - Maximum possible score.
 * @property {number} accuracy_percentage - Score percentage (0 to 100).
 * @property {string} created_at - ISO 8601 timestamp string.
 */

/**
 * @typedef {Object} CMSPageOverride
 * @property {string} page_path - Relative URL path of the target page.
 * @property {string} selector - CSS selector matching element(s) to override.
 * @property {string} content - Sanitized HTML content string.
 * @property {string} [element_id] - Optional ID fallback for selector targeting.
 * @property {string} [updated_at] - ISO 8601 timestamp string.
 */

/**
 * @typedef {Object} VerbEntry
 * @property {string} [group] - Grammatical verb group or class.
 * @property {string} [auxiliary] - Conjugation auxiliary verb (e.g., 'avoir', 'être').
 * @property {string} [level] - CEFR level badge ('A1', 'A2', 'B1', 'B2', 'C1', 'C2').
 * @property {string} [definition] - Meaning or definition in primary UI language.
 * @property {Object.<string, string[]>} [tenses] - Map of tense/mood names to conjugated forms array.
 * @property {boolean} [irregular] - Whether verb follows irregular conjugation patterns.
 */

/**
 * @typedef {Object} NounEntry
 * @property {string} [gender] - Grammatical gender ('Masculin', 'Féminin', 'Neuter').
 * @property {string} [level] - CEFR proficiency level.
 * @property {string} [definition] - Noun definition or translation.
 * @property {string} [article] - Definite article ('le', 'la', 'der', 'die', etc.).
 * @property {string} [plural] - Plural form of the noun.
 */

/**
 * @typedef {Object} AdjectiveEntry
 * @property {string} [level] - CEFR proficiency level.
 * @property {string} [definition] - Meaning or definition.
 * @property {string[]} [prepositions] - Associated prepositional regime.
 * @property {string} [grammar_rule] - Applicable syntax or preposition rule.
 */

/**
 * @typedef {Object} LexiconUnit
 * @property {string} lemma - Headword / lemma in canonical form.
 * @property {string} [pos] - Part of speech tag ('V', 'N', 'ADJ', 'OTHER').
 * @property {string} [source] - Provenance source ('UniMorph', 'Kaikki/Wiktionary').
 * @property {string} [source_url] - External source reference link.
 * @property {Array<string|{form: string, features?: string[]}>} [forms] - Inflected form items.
 */

/**
 * @typedef {Object} LessonModel
 * @property {string} id - Unique lesson identifier.
 * @property {string} title - Human-readable lesson title.
 * @property {string} lang - Target language code ('fr', 'it', 'de', etc.).
 * @property {string} [level] - Target CEFR level.
 * @property {string[]} [topics] - Grammatical or vocabulary topic tags.
 */

/**
 * @typedef {Object} CourseModel
 * @property {string} id - Course identifier.
 * @property {string} title - Course title.
 * @property {string} lang - Target language code.
 * @property {LessonModel[]} [lessons] - List of constituent lessons in course.
 */
