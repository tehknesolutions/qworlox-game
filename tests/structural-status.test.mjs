import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyStructuralStatus } from '../game/board/structural-status.mjs';

test('unchanged diff is UNCHANGED', () => {
  assert.equal(classifyStructuralStatus({ status: 'UNCHANGED', changes: [] }, { ok: true }).status, 'UNCHANGED');
});

test('metric changes are CHANGED, not automatically breaking', () => {
  assert.equal(classifyStructuralStatus({ status: 'CHANGED', changes: [{ key: 'blue:center:4', status: 'CHANGED', delta: { totalPaths: 1 } }] }, { ok: true }).status, 'CHANGED');
});

test('removed structural cells are BREAKING', () => {
  const result = classifyStructuralStatus({ status: 'CHANGED', changes: [{ key: 'blue:center:4', status: 'REMOVED' }] }, { ok: true });
  assert.equal(result.status, 'BREAKING');
});

test('invalid baseline is BREAKING', () => {
  const result = classifyStructuralStatus({ status: 'UNCHANGED', changes: [] }, { ok: false, errors: ['boardId changed'] });
  assert.equal(result.status, 'BREAKING');
  assert.match(result.reasons[0], /boardId changed/);
});
