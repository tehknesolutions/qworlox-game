import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parsePersistedBaselineRegistry } from './persisted-baseline-registry.mjs';
import { selectBaseline } from './structural-baseline-registry.mjs';
import { parsePersistedAcceptanceRegistry } from './persisted-acceptance-registry.mjs';
import { createBaselineAcceptance } from './structural-baseline-acceptance.mjs';
import { registerAcceptance } from './structural-acceptance-registry.mjs';
import { parseAcceptArgs, serializeAcceptanceRegistry } from './accept-structural-baseline-cli.mjs';

const args = parseAcceptArgs(process.argv.slice(2));
const baselinePath = fileURLToPath(new URL('./baselines/king-reach-playable-v1.registry.json', import.meta.url));
const acceptancePath = fileURLToPath(new URL('./baselines/king-reach-playable-v1.acceptance-registry.json', import.meta.url));
const temporaryPath = `${acceptancePath}.tmp`;
const baselines = parsePersistedBaselineRegistry(await readFile(baselinePath, 'utf8'));
const acceptances = parsePersistedAcceptanceRegistry(await readFile(acceptancePath, 'utf8'));
const snapshot = selectBaseline(baselines, args.version);
const acceptance = await createBaselineAcceptance(snapshot, args);
const next = registerAcceptance(acceptances, acceptance);
await writeFile(temporaryPath, serializeAcceptanceRegistry(next), { encoding: 'utf8', flag: 'wx' });
try { await rename(temporaryPath, acceptancePath); } catch (error) { try { await unlink(temporaryPath); } catch {} throw error; }
process.stdout.write(`STRUCTURAL_BASELINE_ACCEPTED=${args.version}\n`);
