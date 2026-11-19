import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**', '**/data/**', 'scripts/archive/**'] },
  js.configs.recommended,
  {
    // Browser code: tools, shared UI, engines
    files: ['tools/**/*.js', 'shared/**/*.js', 'practice/**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'script', globals: { ...globals.browser, COSYEscape: 'readonly', ConjugatorEngineBase: 'readonly', GenderEngineBase: 'readonly' } },
    rules: { 'no-var': 'warn', 'prefer-const': 'warn', eqeqeq: ['warn', 'smart'] },
  },
  {
    // Shared classic-script modules that also export for Node tests
    files: ['shared/engines/*-base.js', 'shared/js/escape.js'],
    languageOptions: { globals: { module: 'readonly' } },
    rules: { 'no-redeclare': ['error', { builtinGlobals: false }] },
  },
  {
    // Service worker
    files: ['sw.js'],
    languageOptions: { globals: { ...globals.serviceworker } },
  },
  {
    // Node build/test scripts
    files: ['scripts/**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node } },
  },
];
