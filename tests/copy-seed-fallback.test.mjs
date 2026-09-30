import test from 'node:test';
import assert from 'node:assert/strict';
import { copySeedText } from '../game/ui/copy-seed.mjs';

test('copies seed through Clipboard API when available', async () => {
  let copied = null;
  const result = await copySeedText('seed-42', { clipboard: { writeText: async value => { copied = value; } } });
  assert.equal(copied, 'seed-42');
  assert.deepEqual(result, { copied: true, method: 'clipboard' });
});

test('unsupported Clipboard API is informative and never throws', async () => {
  const result = await copySeedText('seed-42', { clipboard: null });
  assert.deepEqual(result, { copied: false, method: 'manual' });
});

test('Clipboard rejection degrades to manual copy instead of gameplay error', async () => {
  const result = await copySeedText('seed-42', { clipboard: { writeText: async () => { throw new Error('denied'); } } });
  assert.deepEqual(result, { copied: false, method: 'manual' });
});
