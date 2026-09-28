import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../game/ui/playable-browser-app.mjs', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../game/ui/playable.css', import.meta.url), 'utf8');

test('index boots the playable browser module and provides a mount point', () => {
  assert.match(index, /id="qworlox-app"/);
  assert.match(index, /game\/ui\/playable-browser-app\.mjs/);
  assert.match(index, /game\/ui\/playable\.css/);
});

test('browser app delegates interactions to the controller', () => {
  assert.match(app, /createBrowserController/);
  assert.match(app, /selectCharacter/);
  assert.match(app, /\.roll\(/);
  assert.match(app, /chooseNode/);
  assert.match(app, /data-legal-choice/);
});

test('playable stylesheet gives board a spatial layout and visible legal choices', () => {
  assert.match(css, /\.qworlox-board\s*\{/);
  assert.match(css, /display:\s*grid/);
  assert.match(css, /\[data-legal-choice="true"\]/);
  assert.match(css, /\.qworlox-victory/);
});
