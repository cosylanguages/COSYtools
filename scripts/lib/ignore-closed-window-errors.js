/**
 * The jsdom-based tests close each page's window when they are done with it. A page script that is still
 * waiting for a fetch then runs afterwards, finds no `document` and throws outside jsdom's own error
 * reporting, which would kill the whole test process (seen as a random failure in CI).
 *
 * Errors raised while a window is open are NOT affected: they arrive through the virtual console
 * ("jsdomError") and each test counts them. Anything that did not come from a page script is rethrown.
 */
process.on('uncaughtException', err => {
  if (err && /http:\/\/localhost:\d+\//.test(String(err.stack))) return;   // page script after its window was closed
  console.error(err);
  process.exit(1);
});
