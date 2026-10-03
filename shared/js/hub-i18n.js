(function() {
    'use strict';

    // UI Language Translations for COSYtools Hub Pages (copied verbatim from ui.js)
    const HUB_I18N = {
        en: {
            nav_core_tools: "Core Tools 🛠️",
            nav_conjugation: "Conjugation 📜",
            nav_gender: "Gender ⚖️",
            nav_cases: "Cases 🏛️",
            nav_prepositions: "Prepositions 📍",
            nav_practice: "Practice Drills ⚡",
            hero_tag: "📲 Always Free · 100% Client-Side · No Tracking",
            hero_title: "Language Reference & Practice Tools",
            hero_subtext: "Conjugation engines, gender checkers, case systems, and more across 14 languages.",
            search_placeholder: "Search verbs, nouns, or rules...",
            filter_lang_label: "Language:",
            filter_all_langs: "All Languages (14)",
            cat_core_tools: "✨ Core Reference Tools",
            cat_detailed_tools: "📜 Detailed Language Reference Applications",
            card_conj_title: "Multi-Language Conjugation",
            card_conj_desc: "Compare verb conjugation tables with tense/mood filters across English, French, Italian, Russian, and Greek.",
            card_gender_title: "Gender Checker",
            card_gender_desc: "Instant noun gender lookup with article guidelines, plural rules, and common exceptions.",
            card_cases_title: "Case Systems",
            card_cases_desc: "Interactive declension matrices for Russian (6 cases) and Greek (4 cases) with clickable rule breakdowns.",
            card_prep_title: "Multi-Language Prepositions",
            card_prep_desc: "Compare dependent prepositions, case governing rules, and usage examples across 5 major languages.",
            card_patterns_title: "Verb Patterns",
            card_patterns_desc: "Pedagogical pattern groups (vowel change, add -en, same past participle, radical shifts).",
            card_declensions_title: "Noun Declensions",
            card_declensions_desc: "Complete noun ending guides, plural formation rules, and vocalic stem paradigms.",
            card_practice_title: "Quick Practice Drills",
            card_practice_desc: "Targeted drills, SRS memory review, weak spots tracker, and direct integration with COSYgames.",
            btn_compare_langs: "▶ Compare Across Languages",
            btn_launch_gender: "▶ Launch Gender Checker",
            btn_launch_cases: "▶ Launch Case Reference",
            btn_view_patterns: "▶ View Verb Patterns",
            btn_view_declensions: "▶ View Noun Declensions",
            btn_open_drills: "▶ Open Practice Drills",
            promo_title: "Ready to Practice & Apply Your Grammar Knowledge?",
            promo_subtext: "Visit the main COSYlanguages Practice Hub for interactive curriculum exercises, lessons, and multi-skill drills!",
            promo_btn_practice: "Visit COSYlanguages Practice Hub 🎯",
            promo_btn_courses: "Explore All Courses ↗"
        },
        fr: {
            nav_core_tools: "Outils Principaux 🛠️",
            nav_conjugation: "Conjugaison 📜",
            nav_gender: "Genre ⚖️",
            nav_cases: "Cas 🏛️",
            nav_prepositions: "Prépositions 📍",
            nav_practice: "Exercices ⚡",
            hero_tag: "📲 Toujours Gratuit · 100% Côté Client · Sans Traçage",
            hero_title: "Outils de Référence & Pratique Linguistique",
            hero_subtext: "Moteurs de conjugaison, vérificateurs de genre, déclinaisons de cas et plus dans 14 langues.",
            search_placeholder: "Rechercher un verbe, nom...",
            filter_lang_label: "Langue :",
            filter_all_langs: "Toutes les langues (14)",
            cat_core_tools: "✨ Outils de Référence Principaux",
            cat_detailed_tools: "📜 Applications Détaillées de Référence Linguistique",
            card_conj_title: "Conjugaison Multilingue",
            card_conj_desc: "Comparez les tableaux de conjugaison avec filtres de temps/mode en anglais, français, italien, russe et grec.",
            card_gender_title: "Vérificateur de Genre",
            card_gender_desc: "Recherche instantanée du genre des noms, règles d'articles, pluriels et exceptions fréquentes.",
            card_cases_title: "Systèmes de Cas",
            card_cases_desc: "Matrices de déclinaison interactives pour le russe (6 cas) et le grec (4 cas) avec détails explicatifs.",
            card_prep_title: "Prépositions Multilingues",
            card_prep_desc: "Comparez les prépositions dépendantes, la régie des cas et des exemples dans 5 langues majeures.",
            card_patterns_title: "Modèles de Verbes",
            card_patterns_desc: "Groupes de modèles pédagogiques (changement vocalique, ajout de -en, participe passé identique).",
            card_declensions_title: "Déclinaisons des Noms",
            card_declensions_desc: "Guides complets des terminaisons nominales, règles de formation des pluriels et paradigmes de thèmes.",
            card_practice_title: "Exercices de Pratique Rapide",
            card_practice_desc: "Exercices ciblés, révision mémoire SRS, suivi des points faibles et intégration directe avec COSYgames.",
            btn_compare_langs: "▶ Comparer les langues",
            btn_launch_gender: "▶ Lancer le vérificateur de genre",
            btn_launch_cases: "▶ Lancer la référence des cas",
            btn_view_patterns: "▶ Voir les modèles de verbes",
            btn_view_declensions: "▶ Voir les déclinaisons",
            btn_open_drills: "▶ Ouvrir les exercices",
            promo_title: "Prêt à pratiquer et appliquer vos connaissances grammaticales ?",
            promo_subtext: "Visitez le centre d'entraînement principal COSYlanguages pour des exercices interactifs, des leçons et des entraînements !",
            promo_btn_practice: "Visiter le centre d'entraînement 🎯",
            promo_btn_courses: "Explorer tous les cours ↗"
        },
        it: {
            nav_core_tools: "Strumenti Principali 🛠️",
            nav_conjugation: "Coniugazione 📜",
            nav_gender: "Genere ⚖️",
            nav_cases: "Casi 🏛️",
            nav_prepositions: "Preposizioni 📍",
            nav_practice: "Esercitazioni ⚡",
            hero_tag: "📲 Sempre Gratuito · 100% Lato Client · Nessun Tracciamento",
            hero_title: "Strumenti di Consultazione e Esercitazione Linguistica",
            hero_subtext: "Motori di coniugazione, controllo del genere, declinazioni e molto altro in 14 lingue.",
            search_placeholder: "Cerca un verbo, nome...",
            filter_lang_label: "Lingua:",
            filter_all_langs: "Tutte le lingue (14)",
            cat_core_tools: "✨ Strumenti di Riferimento Principali",
            cat_detailed_tools: "📜 Applicazioni Dettagliate di Riferimento Linguistico",
            card_conj_title: "Coniugazione Multilingue",
            card_conj_desc: "Confronta le tabelle di coniugazione dei verbi con filtri per tempo e modo in inglese, francese, italiano, russo e greco.",
            card_gender_title: "Controllo del Genere",
            card_gender_desc: "Ricerca istantanea del genere dei nomi con articoli, regole del plurale ed eccezioni comuni.",
            card_cases_title: "Sistemi dei Casi",
            card_cases_desc: "Matrici di declinazione interattive per il russo (6 casi) e il greco (4 casi) con spiegazioni dei dettagli.",
            card_prep_title: "Preposizioni Multilingui",
            card_prep_desc: "Confronta le preposizioni reggenti, le regole dei casi e gli esempi di utilizzo in 5 lingue principali.",
            card_patterns_title: "Modelli Verbali",
            card_patterns_desc: "Raggruppamenti pedagogici (cambio vocalico, suffisso -en, participio passato invariato).",
            card_declensions_title: "Declinazioni dei Nomi",
            card_declensions_desc: "Guide complete alle terminazioni dei sostantivi, regole per la formazione del plurale e paradigmi.",
            card_practice_title: "Esercizi di Pratica Rapida",
            card_practice_desc: "Esercizi mirati, ripasso mnemonico SRS, tracciamento dei punti deboli e integrazione diretta con COSYgames.",
            btn_compare_langs: "▶ Confronta le lingue",
            btn_launch_gender: "▶ Avvia controllo genere",
            btn_launch_cases: "▶ Avvia riferimento casi",
            btn_view_patterns: "▶ Vedi modelli verbali",
            btn_view_declensions: "▶ Vedi declinazioni dei nomi",
            btn_open_drills: "▶ Apri esercitazioni",
            promo_title: "Pronto per mettere in pratica le tue conoscenze grammaticali?",
            promo_subtext: "Visita l'hub principale di esercitazione di COSYlanguages per esercitazioni interattive e lezioni!",
            promo_btn_practice: "Visita l'Hub di Esercitazione 🎯",
            promo_btn_courses: "Esplora tutti i corsi ↗"
        },
        ru: {
            nav_core_tools: "Основные Инструменты 🛠️",
            nav_conjugation: "Спряжение 📜",
            nav_gender: "Род ⚖️",
            nav_cases: "Падежи 🏛️",
            nav_prepositions: "Предлоги 📍",
            nav_practice: "Тренажеры ⚡",
            hero_tag: "📲 Всегда бесплатно · 100% на стороне клиента · Без трекинга",
            hero_title: "Языковые Справочники и Тренажеры",
            hero_subtext: "Глагольное спряжение, род существительных, падежные системы и другое для 14 языков.",
            search_placeholder: "Поиск глагола, существительного...",
            filter_lang_label: "Язык:",
            filter_all_langs: "Все языки (14)",
            cat_core_tools: "✨ Основные Справочные Инструменты",
            cat_detailed_tools: "📜 Подробные Справочные Приложения по Языкам",
            card_conj_title: "Многоязычное Спряжение",
            card_conj_desc: "Сравнение таблиц спряжения глаголов с фильтрами времен и наклонений для английского, французского, итальянского, русского и греческого.",
            card_gender_title: "Проверка Рода",
            card_gender_desc: "Мгновенный поиск рода существительных, артиклей, правил множественного числа и исключений.",
            card_cases_title: "Падежные Системы",
            card_cases_desc: "Интерактивные матрицы склонения для русского (6 падежей) и греческого (4 падежа) языков с разбором правил.",
            card_prep_title: "Многоязычные Предлоги",
            card_prep_desc: "Сравнение зависящих предлогов, падежного управления и примеров на 5 основных языках.",
            card_patterns_title: "Глагольные Модели",
            card_patterns_desc: "Обучающие группы глагольных моделей (чередование гласных, добавление -en, совпадение форм).",
            card_declensions_title: "Склонение Существительных",
            card_declensions_desc: "Полные руководства по окончаниям существительных, правилам множественного числа и парадигмам.",
            card_practice_title: "Быстрые Тренажеры",
            card_practice_desc: "Целевые упражнения, повторение по интервалам SRS, трекер слабых мест и интеграция с COSYgames.",
            btn_compare_langs: "▶ Сравнить на нескольких языках",
            btn_launch_gender: "▶ Открыть проверку рода",
            btn_launch_cases: "▶ Открыть падежный справочник",
            btn_view_patterns: "▶ Посмотреть модели глаголов",
            btn_view_declensions: "▶ Посмотреть склонения",
            btn_open_drills: "▶ Открыть тренажеры",
            promo_title: "Готовы применить знания грамматики на практике?",
            promo_subtext: "Посетите основной учебный центр COSYlanguages для прохождения интерактивных упражнений и уроков!",
            promo_btn_practice: "Перейти в учебный центр 🎯",
            promo_btn_courses: "Все курсы COSYlanguages ↗"
        },
        el: {
            nav_core_tools: "Βασικά Εργαλεία 🛠️",
            nav_conjugation: "Κλίση 📜",
            nav_gender: "Γένος ⚖️",
            nav_cases: "Πτώσεις 🏛️",
            nav_prepositions: "Προθέσεις 📍",
            nav_practice: "Ασκήσεις ⚡",
            hero_tag: "📲 Πάντα Δωρεάν · 100% Client-Side · Χωρίς Παρακολούθηση",
            hero_title: "Εργαλεία Αναφοράς & Εξάσκησης Γλωσσών",
            hero_subtext: "Μηχανές κλίσης ρημάτων, έλεγχος γένους, πτώσεις και πολλά άλλα σε 14 γλώσσες.",
            search_placeholder: "Αναζήτηση ρήματος, ουσιαστικού...",
            filter_lang_label: "Γλώσσα:",
            filter_all_langs: "Όλες οι Γλώσσες (14)",
            cat_core_tools: "✨ Βασικά Εργαλεία Αναφοράς",
            cat_detailed_tools: "📜 Αναλυτικές Εφαρμογές Γλωσσικής Αναφοράς",
            card_conj_title: "Πολυγλωσσική Κλίση Ρημάτων",
            card_conj_desc: "Σύγκριση πινάκων κλίσης ρημάτων με φίλτρα χρόνων και εγκλίσεων σε αγγλικά, γαλλικά, ιταλικά, ρωσικά και ελληνικά.",
            card_gender_title: "Έλεγχος Γένους",
            card_gender_desc: "Άμεση αναζήτηση γένους ουσιαστικών με κανόνες άρθρων, πληθυντικού και εξαιρέσεις.",
            card_cases_title: "Συστήματα Πτώσεων",
            card_cases_desc: "Διαδραστικοί πίνακες κλίσης για τα ρωσικά (6 πτώσεις) και τα ελληνικά (4 πτώσεις) με επεξηγήσεις.",
            card_prep_title: "Πολυγλωσσικές Προθέσεις",
            card_prep_desc: "Σύγκριση εξαρτώμενων προθέσεων, κανόνων σύνταξης πτώσεων και παραδειγμάτων σε 5 κύριες γλώσσες.",
            card_patterns_title: "Μοτίβα Ρημάτων",
            card_patterns_desc: "Παιδαγωγικές ομάδες μοτίβων (αλλαγή φωνήεντος, προσθήκη -en, ίδια μετοχή).",
            card_declensions_title: "Κλίση Ουσιαστικών",
            card_declensions_desc: "Πλήρεις οδηγοί καταλήξεων ουσιαστικών, κανόνες πληθυντικού και παραδείγματα.",
            card_practice_title: "Γρήγορες Ασκήσεις Εξάσκησης",
            card_practice_desc: "Στοχευμένες ασκήσεις, επανάληψη SRS, παρακολούθηση αδύναμων σημείων και σύνδεση με το COSYgames.",
            btn_compare_langs: "▶ Σύγκριση σε όλες τις γλώσσες",
            btn_launch_gender: "▶ Έναρξη ελέγχου γένους",
            btn_launch_cases: "▶ Έναρξη αναφοράς πτώσεων",
            btn_view_patterns: "▶ Προβολή μοτίβων ρημάτων",
            btn_view_declensions: "▶ Προβολή κλίσης ουσιαστικών",
            btn_open_drills: "▶ Άνοιγμα ασκήσεων",
            promo_title: "Έτοιμοι να εφαρμόσετε τις γνώσεις γραμματικής σας;",
            promo_subtext: "Επισκεφθείτε το κεντρικό κέντρο εξάσκησης COSYlanguages για διαδραστικές ασκήσεις και μαθήματα!",
            promo_btn_practice: "Επίσκεψη στο Κέντρο Εξάσκησης 🎯",
            promo_btn_courses: "Εξερευνήστε όλα τα Μαθήματα ↗"
        }
    };

    window.COSY_UI = window.COSY_UI || {};
    window.COSY_UI.setUILanguage = function(langCode) {
        if (!HUB_I18N[langCode]) langCode = 'en';
        localStorage.setItem('cosy_ui_lang', langCode);
        document.documentElement.lang = langCode;

        const select = document.getElementById('cosy-ui-language-select');
        if (select) select.value = langCode;

        const dict = HUB_I18N[langCode];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (dict[key]) el.setAttribute('placeholder', dict[key]);
        });
    };

    function init() {
        const savedLang = localStorage.getItem('cosy_ui_lang') || 'en';
        window.COSY_UI.setUILanguage(savedLang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
