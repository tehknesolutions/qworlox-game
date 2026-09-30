import test from 'node:test';
import assert from 'node:assert/strict';
import { nextRestartModalFocus } from '../game/ui/restart-modal-focus.mjs';

test('Tab wraps from last control to first', () => {
  assert.equal(nextRestartModalFocus({ current: 1, count: 2, shiftKey: false }), 0);
});

test('Shift+Tab wraps from first control to last', () => {
  assert.equal(nextRestartModalFocus({ current: 0, count: 2, shiftKey: true }), 1);
});

test('Tab advances within modal controls', () => {
  assert.equal(nextRestartModalFocus({ current: 0, count: 2, shiftKey: false }), 1);
});

test('focus helper rejects empty modal controls', () => {
  assert.throws(() => nextRestartModalFocus({ current: 0, count: 0, shiftKey: false }), /focusable control/);
});
