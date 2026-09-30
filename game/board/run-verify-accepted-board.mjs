import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parsePersistedBaselineRegistry } from './persisted-baseline-registry.mjs';
import { parsePersistedAcceptanceRegistry } from './persisted-acceptance-registry.mjs';
import { verifyAcceptedBaselineVersion } from './verify-accepted-board.mjs';

const args = process.argv.slice(2);
const index = args.indexOf('--version');
const version = index >= 0 ? args[index + 1] : null;
if (!version) throw new Error('--version is required');
const baselinePath = fileURLToPath(new URL('./baselines/king-reach-playable-v1.registry.json', import.meta.url));
const acceptancePath = fileURLToPath(new URL('./baselines/king-reach-playable-v1.acceptance-registry.json', import.meta.url));
const baselines = parsePersistedBaselineRegistry(await readFile(baselinePath, 'utf8'));
const acceptances = parsePersistedAcceptanceRegistry(await readFile(acceptancePath, 'utf8'));
const result = await verifyAcceptedBaselineVersion(baselines, acceptances, version);
if (!result.ok) {
  console.error(`STRUCTURAL_ACCEPTANCE_VERIFY=FAIL reason=${result.reason}`);
  process.exit(1);
}
process.stdout.write(`STRUCTURAL_ACCEPTANCE_VERIFY=PASS version=${version} hash=${result.snapshotHash}\n`);
