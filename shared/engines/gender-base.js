/**
 * GenderEngineBase — flow shared by the noun-gender tools (fr/genre, it/genere, …).
 *
 * A subclass supplies:
 *   - options: { storeKey, strings }
 *   - searchNoun(q), renderNoun(q, data)      language-specific lookup/rendering
 *   - getEndingClass(noun, data)              ending-class rule
 *   - nextEndingQuestion(), nextArticlesQuestion()   language-specific question builders
 *   - optionally srsKey(kind, question)       spaced-repetition key convention
 *
 * `strings` holds every learner-facing sentence the shared flow needs, so no UI text is
 * hardcoded here. Interpolated values are passed already HTML-escaped.
 *
 *   strings = {
 *     genderPrompt:   'Quel est le genre de :',
 *     genderRight:    (noun, gender)    => `✅ … <strong>${noun}</strong> …`,
 *     genderWrong:    (noun, expected)  => `❌ …`,
 *     endingRight:    (label, gender)   => `✅ …`,
 *     endingWrong:    (label, gender)   => `❌ …`,
 *     articlesRight:  (form, noun)      => `✅ …`,
 *     articlesWrong:  (expected, noun)  => `❌ …`,
 *   }
 *
 * Classic <script>: load after srs-store.js and escape.js, before the tool's js/engine.js.
 */
/* global SpacedRepetitionStore, COSYEscape */
class GenderEngineBase {
  /**
   * @param {{storeKey: string, strings: object, dataUrl?: string}} options
   */
  constructor({ storeKey, strings, dataUrl = 'data/nouns.json' }) {
    this.nounDb = {};
    this.isGameActive = false;
    this.gameScore = 0;
    this.gameStreak = 0;
    this.currentQuestion = null;
    this.gamePracticeMode = 'gender';
    this.strings = strings;
    this.dataUrl = dataUrl;
    this.srsStore = typeof SpacedRepetitionStore !== 'undefined' ? new SpacedRepetitionStore(storeKey) : null;
    this.init();
  }

  /**
   * Key under which an answer is recorded in the spaced-repetition store.
   * Default: the bare noun. Tools that already shipped another convention override this
   * so learners' saved progress keeps working.
   * @param {'gender'|'ending'|'articles'} _kind
   * @param {{noun: string}} question
   */
  srsKey(_kind, question) {
    return question.noun;
  }

  async init() {
    try {
      const res = await fetch(this.dataUrl);
      this.nounDb = await res.json();
      this.bindEvents();
      this.handleInitialQueryParams();
    } catch (err) {
      console.error(err);
    }
  }

  handleInitialQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = ['noun', 'word', 'q', 'search'].map((key) => params.get(key)).find((v) => v && v.trim());
    const input = document.getElementById('noun-search-input');
    if (initialQuery && input) {
      input.value = initialQuery;
      this.searchNoun(initialQuery);
    }
  }

  bindEvents() {
    const input = document.getElementById('noun-search-input');
    if (input) {
      input.addEventListener('input', (e) => this.handleInput(e.target.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.searchNoun(input.value);
      });
    }
    const box = document.getElementById('search-suggestions');
    if (box) {
      box.addEventListener('click', (e) => {
        const item = e.target.closest('[data-key]');
        if (item) this.searchNoun(item.dataset.key);
      });
    }
  }

  handleInput(query) {
    const q = query.trim().toLowerCase();
    const box = document.getElementById('search-suggestions');
    if (!q) {
      box.style.display = 'none';
      return;
    }
    const esc = COSYEscape.escapeHtml;
    const matches = Object.keys(this.nounDb).filter((n) => n.startsWith(q));
    if (matches.length > 0) {
      box.innerHTML = matches
        .map(
          (n) => `
                <button type="button" class="suggestion-item" data-key="${esc(n)}">
                    <span><strong>${esc(n)}</strong></span>
                    <span class="article">${esc(this.nounDb[n].gender)}</span>
                </button>
            `
        )
        .join('');
      box.style.display = 'block';
    } else {
      box.style.display = 'none';
    }
  }

  setPracticeMode(mode) {
    this.gamePracticeMode = mode;
    const gBtn = document.getElementById('mode-gender-btn');
    const eBtn = document.getElementById('mode-ending-btn');
    const cBtn = document.getElementById('mode-cases-btn');
    if (gBtn && cBtn) {
      gBtn.className = mode === 'gender' ? 'badge active-mode' : 'badge';
      cBtn.className = mode === 'articles' ? 'badge active-mode' : 'badge';
    }
    if (eBtn) eBtn.className = mode === 'ending' ? 'badge active-mode' : 'badge';
    this.nextGameQuestion();
  }

  toggleGameMode() {
    this.isGameActive = !this.isGameActive;
    document.getElementById('game-container').style.display = this.isGameActive ? 'block' : 'none';
    document.getElementById('search-section-container').style.display = this.isGameActive ? 'none' : 'block';
    document.getElementById('noun-result-container').style.display = 'none';
    document.getElementById('empty-state').style.display = this.isGameActive ? 'none' : 'block';
    if (this.isGameActive) this.nextGameQuestion();
  }

  nextGameQuestion() {
    if (this.gamePracticeMode === 'ending') {
      this.nextEndingQuestion();
      return;
    }
    if (this.gamePracticeMode === 'articles') {
      this.nextArticlesQuestion();
      return;
    }
    const choiceGroup = document.querySelector('.game-choice-group');
    const mcGroup = document.getElementById('game-mc-options');
    if (choiceGroup) choiceGroup.style.display = 'flex';
    if (mcGroup) mcGroup.style.display = 'none';
    const label = document.querySelector('.prompt-label');
    if (label) label.textContent = this.strings.genderPrompt;
    const nouns = Object.keys(this.nounDb);
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    this.currentQuestion = { noun: randomNoun, expectedGender: this.nounDb[randomNoun].gender };
    document.getElementById('game-noun-prompt').textContent = randomNoun;
    document.getElementById('game-feedback-box').style.display = 'none';
    document.getElementById('game-next-btn').style.display = 'none';
  }

  /** Shared tail of every answer check: SRS, score display, "next" button. */
  _finishAnswer(kind, isCorrect) {
    if (this.srsStore) this.srsStore.recordAnswer(this.srsKey(kind, this.currentQuestion), isCorrect);
    document.getElementById('game-score').textContent = this.gameScore;
    document.getElementById('game-streak').textContent = this.gameStreak;
    document.getElementById('game-next-btn').style.display = 'block';
  }

  checkGameChoice(gender) {
    if (!this.currentQuestion) return;
    const esc = COSYEscape.escapeHtml;
    const isCorrect = gender === this.currentQuestion.expectedGender;
    const feedback = document.getElementById('game-feedback-box');
    feedback.style.display = 'block';
    if (isCorrect) {
      this.gameScore += 10;
      this.gameStreak += 1;
      feedback.className = 'feedback-card correct';
      feedback.innerHTML = this.strings.genderRight(esc(this.currentQuestion.noun), esc(gender));
    } else {
      this.gameStreak = 0;
      feedback.className = 'feedback-card wrong';
      feedback.innerHTML = this.strings.genderWrong(
        esc(this.currentQuestion.noun),
        esc(this.currentQuestion.expectedGender)
      );
    }
    this._finishAnswer('gender', isCorrect);
  }

  checkEndingChoice(selected) {
    if (!this.currentQuestion) return;
    const esc = COSYEscape.escapeHtml;
    const data = this.nounDb[this.currentQuestion.noun];
    const expected = this.getEndingClass(this.currentQuestion.noun, data);
    const feedback = document.getElementById('game-feedback-box');
    const isCorrect = selected === expected.key;
    feedback.style.display = 'block';
    feedback.className = `feedback-card ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = isCorrect
      ? this.strings.endingRight(esc(expected.label), esc(data.gender))
      : this.strings.endingWrong(esc(expected.label), esc(data.gender));
    this.gameScore += isCorrect ? 10 : 0;
    this.gameStreak = isCorrect ? this.gameStreak + 1 : 0;
    this._finishAnswer('ending', isCorrect);
  }

  checkArticlesChoice(selected) {
    if (!this.currentQuestion) return;
    const esc = COSYEscape.escapeHtml;
    const isCorrect = selected === this.currentQuestion.expected;
    const feedback = document.getElementById('game-feedback-box');
    feedback.style.display = 'block';
    if (isCorrect) {
      this.gameScore += 10;
      this.gameStreak += 1;
      feedback.className = 'feedback-card correct';
      feedback.innerHTML = this.strings.articlesRight(esc(selected), esc(this.currentQuestion.noun));
    } else {
      this.gameStreak = 0;
      feedback.className = 'feedback-card wrong';
      feedback.innerHTML = this.strings.articlesWrong(esc(this.currentQuestion.expected), esc(this.currentQuestion.noun));
    }
    this._finishAnswer('articles', isCorrect);
  }
}

if (typeof window !== 'undefined') window.GenderEngineBase = GenderEngineBase;
if (typeof module === 'object' && module.exports) module.exports = GenderEngineBase;
