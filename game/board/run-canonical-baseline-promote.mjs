import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parsePersistedBaselineRegistry } from './persisted-baseline-registry.mjs';
import { parsePersistedAcceptanceRegistry } from './persisted-acceptance-registry.mjs';
import { verifyAcceptedBaselineVersion } from './verify-accepted-board.mjs';
import { promoteCanonicalBaseline } from './canonical-baseline-promotion.mjs';

const args = process.argv.slice(2);
const index = args.indexOf('--version');
const version = index >= 0 ? args[index + 1] : null;
if (!version) throw new Error('--version is required');
const path = name => fileURLToPath(new URL(`./baselines/${name}`, import.meta.url));
const canonicalPath = path('king-reach-playable-v1.canonical.json');
const temporaryPath = `${canonicalPath}.tmp`;
const declaration = JSON.parse(await readFile(canonicalPath, 'utf8'));
const baselines = parsePersistedBaselineRegistry(await readFile(path('king-reach-playable-v1.registry.json'), 'utf8'));
const acceptances = parsePersistedAcceptanceRegistry(await readFile(path('king-reach-playable-v1.acceptance-registry.json'), 'utf8'));
const promoted = await promoteCanonicalBaseline(declaration, version, candidate => verifyAcceptedBaselineVersion(baselines, acceptances, candidate));
await writeFile(temporaryPath, `${JSON.stringify(promoted.declaration, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
try { await rename(temporaryPath, canonicalPath); } catch (error) { try { await unlink(temporaryPath); } catch {} throw error; }
process.stdout.write(`CANONICAL_BASELINE_PROMOTED=${version} hash=${promoted.verification.snapshotHash}\n`);
