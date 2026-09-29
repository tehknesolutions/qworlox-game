import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../game/ui/playable.css', import.meta.url), 'utf8');

test('board visually separates blue, contested and red territory', () => {
  assert.match(css, /data-node-id="blue-approach"[^}]*--blue-territory/s);
  assert.match(css, /data-node-id="center"[^}]*--contested-territory/s);
  assert.match(css, /data-node-id="red-approach"[^}]*--red-territory/s);
});

test('King objectives are visually dominant over ordinary route nodes', () => {
  assert.match(css, /data-node-id="blue-king"[^}]*--king-objective/s);
  assert.match(css, /data-node-id="red-king"[^}]*--king-objective/s);
  assert.match(css, /\.qworlox-king[^}]*font-size:\s*1\.35rem/s);
});

test('crossings and contested center have distinct functional treatment', () => {
  assert.match(css, /data-node-id="north-crossing"[^}]*--crossing/s);
  assert.match(css, /data-node-id="south-crossing"[^}]*--crossing/s);
  assert.match(css, /data-node-id="center"[^}]*--center-objective/s);
});

test('interaction states override territorial presentation', () => {
  const legalIndex = css.indexOf('[data-legal-choice="true"]');
  const territoryIndex = css.indexOf('--blue-territory');
  assert.ok(territoryIndex >= 0);
  assert.ok(legalIndex > territoryIndex);
  assert.match(css, /data-legal-choice="true"[^}]*--interaction-legal/s);
  assert.match(css, /data-current-move="true"[^}]*--interaction-current/s);
});

test('mobile layout preserves readable node hierarchy without route decoration', () => {
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.qworlox-route-layer\s*\{\s*display:\s*none;/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.qworlox-node\s*\{[^}]*min-height:\s*110px;/);
});
