import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parsePersistedBaselineRegistry } from './persisted-baseline-registry.mjs';
import { parsePersistedAcceptanceRegistry } from './persisted-acceptance-registry.mjs';
import { verifyAcceptedBaselineVersion } from './verify-accepted-board.mjs';
import { resolveCanonicalBaselineGate } from './canonical-baseline-gate.mjs';

const path = name => fileURLToPath(new URL(`./baselines/${name}`, import.meta.url));
const canonical = JSON.parse(await readFile(path('king-reach-playable-v1.canonical.json'), 'utf8'));
if (canonical.schemaVersion !== 1 || canonical.boardId !== 'king-reach-playable-v1') throw new Error('invalid canonical baseline declaration');
let baselines;
let acceptances;
const result = await resolveCanonicalBaselineGate({
  canonicalVersion: canonical.canonicalVersion,
  verify: async version => {
    baselines ??= parsePersistedBaselineRegistry(await readFile(path('king-reach-playable-v1.registry.json'), 'utf8'));
    acceptances ??= parsePersistedAcceptanceRegistry(await readFile(path('king-reach-playable-v1.acceptance-registry.json'), 'utf8'));
    return verifyAcceptedBaselineVersion(baselines, acceptances, version);
  }
});
if (!result.ok) {
  console.error(`CANONICAL_BASELINE_GATE=FAIL reason=${result.reason}`);
  process.exit(1);
}
process.stdout.write(result.status === 'SKIPPED' ? 'CANONICAL_BASELINE_GATE=SKIPPED reason=NO_CANONICAL_BASELINE\n' : `CANONICAL_BASELINE_GATE=PASS version=${result.baselineVersion} hash=${result.snapshotHash}\n`);
