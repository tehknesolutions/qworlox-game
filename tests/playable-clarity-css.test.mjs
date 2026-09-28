import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../game/ui/playable.css', import.meta.url), 'utf8');

test('clarity CSS styles arena reserves selected piece route layer and roll state', () => {
  assert.match(css, /\.qworlox-arena\s*\{/);
  assert.match(css, /\.qworlox-reserve\s*\{/);
  assert.match(css, /\.qworlox-piece\[data-selected="true"\]/);
  assert.match(css, /\.qworlox-route-layer\s*\{/);
  assert.match(css, /\.qworlox-roll-state\s*\{/);
});

test('victory has an explicit presentation state', () => {
  assert.match(css, /\.qworlox-victory\s*\{/);
  assert.match(css, /@keyframes victory-pop/);
});
