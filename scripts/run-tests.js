/**
 * Runs every step listed in package.json "cosyTestSteps" in order and stops at the first failure.
 * Same behaviour as the old `npm run a && npm run b ...` chain, plus:
 *  - one summary line per step with its duration;
 *  - on failure, the step's full output, and a GitHub Actions `::error` annotation naming the step and
 *    the tail of its output, so the cause is visible on the pull request without opening the raw log.
 */
const { spawnSync } = require('node:child_process');
const steps = require('../package.json').cosyTestSteps;

const escapeAnnotation = (s) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');

for (const step of steps) {
  const started = Date.now();
  const result = spawnSync('npm', ['run', '-s', step], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, shell: process.platform === 'win32' });
  const seconds = Math.round((Date.now() - started) / 1000);
  if (result.status === 0) {
    console.log(`PASS ${step} (${seconds}s)`);
    continue;
  }
  const output = `${result.stdout || ''}${result.stderr || ''}${result.error ? String(result.error) : ''}`;
  console.log(`FAIL ${step} (${seconds}s, exit ${result.status})\n`);
  console.log(output);
  const tail = output.split('\n').slice(-40).join('\n').slice(-3500);
  console.log(`::error title=npm test failed at ${step} (${seconds}s)::${escapeAnnotation(tail)}`);
  process.exit(result.status || 1);
}
console.log(`\nAll ${steps.length} test steps passed.`);
