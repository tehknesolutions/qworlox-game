# King Reach Playable Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the smallest end-to-end playable Q'Worlox match in which two teams alternate turns, move across a contested board, resolve minimal interactions, reach the opposing King, declare a winner, and preserve/replay the match through the canonical Event Log.

**Architecture:** Keep the existing headless Game Core as the single rules authority. Add King objectives and victory as domain concepts, then connect the existing roll/move/land/event pipeline into a minimal match controller and a deliberately simple playable presentation. The slice proves the complete game loop before expanding cards, combat depth, art or final geometry.

**Tech Stack:** Node.js >=22, ECMAScript modules, `node:test`, existing graph-based Game Core, canonical Event Log/replay V1.

**Spec:** `docs/GDD-V0.3.md`

## Global Constraints

- Physical and digital are the same game and use the same rules authority.
- Fundamental objective: cross the map and reach the opposing King before the adversary reaches yours.
- Do not silently decide unresolved King-contact details; lock each required choice explicitly before implementation.
- No permanent HP/elimination system in the baseline.
- Board topology is graph-defined; visual adjacency is not movement permission.
- Replay reconstructs recorded facts and must not become a second Game Core.
- Use TDD: failing test first, minimal implementation, verification, commit.
- Node runtime floor: >=22.

## Review Focus

1. A player cannot win by reaching their own King or a non-King destination.
2. A match cannot continue accepting normal moves after victory is declared.
3. Mirrored blue/red routes produce equivalent King-reach behavior.
4. Encounter/effect resolution cannot accidentally skip or duplicate a turn.
5. Event Log replay reconstructs the same winner and terminal position without rerunning randomness.

---

### Task 1: Lock the minimum King Reach rule needed for executable play

**Files:**
- Modify: `docs/GDD-V0.3.md`
- Create: `docs/KING-REACH-SPEC-V0.1.md`

- [ ] Write the explicit v0.1 choice for whether one or both characters must reach the opposing King.
- [ ] Write whether King-node entry itself wins or triggers a final encounter.
- [ ] Define exact/overshoot behavior only as far as required by the playable slice.
- [ ] Mark every remaining King behavior EXPERIMENTAL or UNRESOLVED.
- [ ] Review against Issue #13 and commit the locked v0.1 rule.

**Deliverable:** no executable victory code depends on an unstated design assumption.

### Task 2: Represent Kings in the Board Graph

**Files:**
- Modify: existing board graph/model files under `game/`
- Test: `tests/king-objective-board.test.mjs`

- [ ] Write failing tests proving each team has exactly one opposing King objective reachable through graph edges.
- [ ] Run the test and confirm RED.
- [ ] Add the minimal King/objective descriptor to board nodes or board metadata.
- [ ] Verify mirrored blue/red semantics and reject malformed/missing King objectives.
- [ ] Run relevant tests and commit.

**Deliverable:** the Game Core can identify `blueKing` and `redKing` objectives without reading UI/artwork.

### Task 3: Add canonical King Reach victory evaluation

**Files:**
- Create/modify: focused victory module under `game/core/`
- Test: `tests/king-reach-victory.test.mjs`

- [ ] Write failing tests for enemy-King reach, own-King non-victory, ordinary-node non-victory, and mirrored teams.
- [ ] Confirm RED.
- [ ] Implement the smallest pure victory evaluator from the locked King Reach spec.
- [ ] Add terminal match state: winner + winning character + King node.
- [ ] Run tests and commit.

**Deliverable:** King Reach is an executable rule rather than documentation only.

### Task 4: Integrate victory into MOVE -> LAND resolution

**Files:**
- Modify: existing turn/landing resolver under `game/core/`
- Test: `tests/king-reach-turn.test.mjs`

- [ ] Write failing test: a legal move landing on the opposing King produces victory after LAND.
- [ ] Write failing test: normal landing does not produce victory.
- [ ] Write failing test: post-victory normal turn attempts fail explicitly.
- [ ] Confirm RED.
- [ ] Implement minimal victory check at the landing boundary.
- [ ] Run regression tests and commit.

**Deliverable:** the normal turn pipeline can end a match.

### Task 5: Extend the canonical Event Log with victory facts

**Files:**
- Modify: `game/core/replay.mjs`
- Modify: `game/core/event-log-format.mjs`
- Modify/add relevant event-schema tests
- Test: `tests/event-replay-victory.test.mjs`

- [ ] Define one explicit victory domain event, e.g. `KING_REACHED` or `MATCH_WON`, from the spec rather than inventing both.
- [ ] Write RED tests for strict event shape and causal placement after the winning LAND.
- [ ] Implement event emission in Game Core.
- [ ] Extend replay to reconstruct terminal winner from the recorded victory fact without recomputing gameplay.
- [ ] Extend Event Log V1 schema only if backward compatibility remains explicit; otherwise version intentionally.
- [ ] Verify serialize -> import -> replay preserves winner exactly.
- [ ] Commit.

**Deliverable:** a completed physical/digital match can record and replay its victory.

### Task 6: Build the smallest playable board fixture

**Files:**
- Create: `game/boards/king-reach-playable.v1.mjs` or follow existing board-data convention
- Test: `tests/king-reach-playable-board.test.mjs`

- [ ] Define a deliberately small mirrored graph with blue start, red start, contested center and both King objectives.
- [ ] Write graph-validation tests before implementation.
- [ ] Ensure at least one meaningful route/confrontation choice while avoiding final-geometry claims.
- [ ] Mark fixture as PLAYTEST/EXPERIMENTAL, not final board geometry.
- [ ] Commit.

**Deliverable:** a match can start and finish quickly enough for repeated manual and automated playtests.

### Task 7: Connect a complete match controller

**Files:**
- Create/modify: focused match controller under `game/core/`
- Test: `tests/playable-match.test.mjs`

- [ ] Write an end-to-end failing test from initial state to King Reach victory.
- [ ] Include alternating teams, roll consumption, movement, LAND, at least one contested interaction/effect boundary, and terminal victory.
- [ ] Confirm RED.
- [ ] Implement only the orchestration missing between existing systems.
- [ ] Ensure deterministic injected rolls/seeds for tests.
- [ ] Verify no turn can execute after terminal victory.
- [ ] Commit.

**Deliverable:** the headless Game Core can play a complete deterministic match.

### Task 8: Minimal encounter/combat needed for the playable loop

**Files:**
- Modify existing encounter/combat modules and tests only as needed
- Test: `tests/playable-encounter.test.mjs`

- [ ] Identify the smallest existing combat contract required to unblock a contested path.
- [ ] Write RED test for one complete encounter resolution.
- [ ] Reuse Common Die + optional Exclusive Die boundary; do not build the full future combat system.
- [ ] Ensure result returns play to the race toward the King.
- [ ] Verify no cumulative HP or permanent elimination is introduced.
- [ ] Commit.

**Deliverable:** two opponents can collide and the match can continue deterministically.

### Task 9: Minimal cards/territory content for a meaningful slice

**Files:**
- Modify existing card/territory fixtures
- Test: `tests/playable-effects.test.mjs`

- [ ] Select the minimum content set from the seven established card families; do not implement all content for milestone completion.
- [ ] Include at least one board-triggered effect that visibly changes a tactical choice.
- [ ] Include at least one territory consequence if the existing territory engine is stable enough for the slice.
- [ ] Write RED tests for each selected effect.
- [ ] Implement through existing domain-action/Event Log boundaries.
- [ ] Commit.

**Deliverable:** the slice demonstrates that Q'Worlox is more than a naked race without delaying playability for a full deck.

### Task 10: Add a minimal player-visible digital interface

**Files:**
- Create/modify presentation files according to the repository's existing digital surface; if none exists, create the smallest dependency-free browser surface without moving rules into UI code.
- Test: headless/core tests remain authoritative; add presentation smoke coverage if infrastructure permits.

- [ ] Render the playable board fixture and four characters.
- [ ] Show current team, roll result, selectable movable character and current node.
- [ ] Provide one action path for roll -> choose -> move -> resolve.
- [ ] Display encounter/effect messages from domain events.
- [ ] Display both Kings as unmistakable terminal objectives.
- [ ] Display winner and stop input after victory.
- [ ] Keep all rule decisions delegated to Game Core.
- [ ] Commit.

**Deliverable:** two humans can play the complete slice from one screen.

### Task 11: Match recording and replay UX

**Files:**
- Modify minimal digital presentation
- Reuse: `game/core/event-log-format.mjs`, `game/core/replay.mjs`

- [ ] Add export of the canonical match Event Log document.
- [ ] Add import/replay of a recorded completed match.
- [ ] Show replayed winner and final positions.
- [ ] Reject malformed or causally invalid logs with a visible error.
- [ ] Confirm imported replay performs no random rolls or card draws.
- [ ] Commit.

**Deliverable:** a played match can be saved and replayed deterministically.

### Task 12: Playable Slice acceptance gate

**Files:**
- Create: `docs/PLAYABLE-SLICE-ACCEPTANCE.md`
- Update: `docs/GDD-V0.3.md`

- [ ] Run the complete test suite with `npm test` in an environment where execution is available.
- [ ] Record exact pass/fail evidence; do not call CI green without evidence.
- [ ] Manually play at least one complete Blue-win path and one Red-win path.
- [ ] Replay both completed match logs and compare terminal winner/positions.
- [ ] Record unresolved balance questions separately from functional defects.
- [ ] Confirm physical reproducibility of every rule used in the slice.
- [ ] Mark the milestone PLAYABLE only when all acceptance checks have evidence.
- [ ] Commit acceptance report.

**Deliverable:** first evidence-backed end-to-end playable Q'Worlox slice centered on KING REACH.

## Milestone definition

The slice is **PLAYABLE** when two humans can begin from a known initial state, alternate legal turns, make at least movement/route and encounter/effect decisions, and finish because one side reaches the opposing King under the explicitly locked King Reach rule. The resulting canonical Event Log must serialize, import and replay to the same terminal outcome.

Final art, final board geometry, complete seven-family card library, production component counts and final balance are explicitly **not** prerequisites for this milestone.