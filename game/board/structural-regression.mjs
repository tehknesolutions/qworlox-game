const EXPECTED_SCHEMA_VERSION = 1;
const EXPECTED_BOARD_ID = 'king-reach-playable-v1';
const EXPECTED_CELLS_PER_TEAM = 42;

export function validateStructuralBaseline(result) {
  const errors = [];
  if (result?.boardId !== EXPECTED_BOARD_ID) errors.push(`boardId changed: expected ${EXPECTED_BOARD_ID}, got ${result?.boardId ?? 'missing'}`);
  const blue = result?.analysis?.blue?.balance;
  const red = result?.analysis?.red?.balance;
  if (blue?.cells !== EXPECTED_CELLS_PER_TEAM) errors.push(`BLUE cell count changed: expected ${EXPECTED_CELLS_PER_TEAM}, got ${blue?.cells ?? 'missing'}`);
  if (red?.cells !== EXPECTED_CELLS_PER_TEAM) errors.push(`RED cell count changed: expected ${EXPECTED_CELLS_PER_TEAM}, got ${red?.cells ?? 'missing'}`);
  const symmetry = result?.analysis?.symmetry;
  if (symmetry?.comparedCells !== EXPECTED_CELLS_PER_TEAM) errors.push(`symmetry comparison count changed: expected ${EXPECTED_CELLS_PER_TEAM}, got ${symmetry?.comparedCells ?? 'missing'}`);
  return { ok: errors.length === 0, errors, schemaVersion: EXPECTED_SCHEMA_VERSION };
}

export const STRUCTURAL_BASELINE = Object.freeze({
  schemaVersion: EXPECTED_SCHEMA_VERSION,
  boardId: EXPECTED_BOARD_ID,
  cellsPerTeam: EXPECTED_CELLS_PER_TEAM
});
