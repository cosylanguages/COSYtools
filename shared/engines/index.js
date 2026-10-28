/**
 * COSYtools Shared Engines & Reference Utilities Entry Point
 * Exposes reference utilities, practice engine, and SRS store for ecosystem integration.
 */
const COSYReferenceUtils = require('./reference-utils.js');
const PracticeEngine = require('./practice-engine.js');
const SpacedRepetitionStore = require('./srs-store.js');

module.exports = {
  COSYReferenceUtils,
  PracticeEngine,
  SpacedRepetitionStore
};
