# Q'Worlox: Medieval Battle — Board Geometry Model v1

**Status:** ARCHITECTURAL CANDIDATE / SIMULATION REQUIRED  
**Purpose:** define a mathematical model for the official Q'Worlox board before locking its final physical geometry.

## 1. Authority boundary

Q'Worlox uses HNK Mandala research as a mathematical/structural reference, not as a claim that the board itself is the HNK Mandala.

The source geometry currently supports:

- 72 angular sectors of 5°;
- 6 radial sectorized layers;
- 432 regular Mandala fields (`6 × 72`);
- 9 outer choir/group cells, each spanning 8 sectors / 40°;
- 22 central Rose fields (`3 + 7 + 12`);
- 463 major address candidates (`432 + 9 + 22`);
- a hierarchical core excluded from that address count.

The source graph model further supports the regular Mandala field topology `P6 □ C72`: six radial positions crossed with a 72-node angular cycle. The 9 outer groups form `C9`; the known central Rose families form independent cycles `C3`, `C7`, and `C12`. Cross-domain edges between regular Mandala fields and the central Rose remain unresolved in the source and MUST NOT be fabricated as HNK canon.

## 2. Q'Worlox projection thesis

The official Q'Worlox board should be designed as a **playable orthogonal projection inspired by Mandala invariants**, not as a literal 463-cell reproduction.

Pipeline:

`HNK Mandala structural invariants → Q'Worlox projection → playable graph → simulation → human playtest → physical board lock`

## 3. Preserve vs derive

### Source-supported HNK constants

- 72
- 6 × 72
- 9 × 8 = 72
- 5° sector width
- 40° group span
- 3 + 7 + 12 = 22
- cyclic/angular adjacency
- radial adjacency

### Q'Worlox-derived design choices

The following are game-design hypotheses, not HNK source claims:

- mapping circular sectors into orthogonal corridors;
- using reductions such as `72 → 36 → 18 → 9`;
- assigning HNK counts to route lengths or checkpoints;
- assigning the central region to a 3/7/12/22 gameplay structure;
- mapping the existing double corridor to parallel graph lanes;
- mapping team bases and goals onto Mandala-derived positions.

Every such mapping must be validated for gameplay.

## 4. Board graph model

Represent the board independently of artwork.

### Node types

- `START` — character starting slot/base.
- `ENTRY` — first playable route node after release from base.
- `LANE` — ordinary movement position.
- `JUNCTION` — legal route choice.
- `CENTER` — central strategic position/region.
- `GOAL_ENTRY` — transition into a destination area.
- `GOAL` — completed character position.

### Edge types

- `FORWARD`
- `PARALLEL_LANE`
- `MERGE`
- `SPLIT`
- `GOAL_TRANSITION`

The game graph is the rule authority for legal movement. Artwork renders the graph; it does not invent connectivity.

## 5. Double-lane corridor

The existing official visual direction includes a double corridor. In graph terms it must therefore be modeled as two explicit parallel lane sequences rather than one visual strip with ambiguous movement.

Candidate form:

```text
A1 — A2 — A3 — ... — An
|     |     |           |
B1 — B2 — B3 — ... — Bn
```

Whether lateral `Ai ↔ Bi` transitions are legal at every index, selected junctions only, or never during ordinary movement is **UNRESOLVED** and must be simulation-tested.

## 6. Symmetry requirement

Before intentional asymmetric abilities are introduced, both teams must have equal baseline geometry:

- equal shortest start→goal distance;
- equal number of mandatory junctions;
- equal access cost to the center;
- equal number of conflict opportunities under mirrored play;
- equivalent lane-change opportunities.

Visual asymmetry may exist; graph disadvantage may not be accidental.

## 7. Mandala projection candidates

Three candidate projections should be compared digitally.

### Candidate A — 72-step macrocycle

Use 72 as the total principal traversal budget or principal graph-cycle reference. Strongest preservation of the outer Mandala count, but potentially too long for a four-piece race unless compressed by shortcuts/goal transitions.

### Candidate B — 36-step half-cycle

Use 36 as a playable reduction of 72 while preserving exact divisibility by 2, 3, 4, 6, 9, 12 and 18. This is a strong candidate for first simulation because it retains rich factorization while shortening play.

### Candidate C — 18-step route

Use 18 as a further exact reduction of 72. This favors faster physical matches and can preserve 9-group bilateral structure, but carries less visible structural resolution.

No candidate is approved until simulation data exists.

## 8. Central region candidates

The HNK source supports the central composition `3 + 7 + 12 = 22`, but does not authorize Q'Worlox gameplay semantics for those values.

For Q'Worlox we may test:

- **3** central tactical nodes;
- **7** central movement positions;
- **12** perimeter positions around the center;
- or a **22-node central macro-region**.

These are experimental projections only.

## 9. Simulation metrics

Each geometry candidate must be evaluated with the same Game Core rules and seeded RNG.

Minimum metrics:

1. average turns to first piece release;
2. average turns to match completion;
3. median and P90 match duration in turns;
4. first-player win rate;
5. team-side win-rate difference;
6. number of encounters per match;
7. number of battles per match;
8. lane-choice frequency;
9. center usage frequency;
10. blocked/illegal movement frequency;
11. number of turns with no meaningful choice;
12. comeback frequency after trailing;
13. Citizen vs Cavalier/Knight contribution once class rules exist.

## 10. Geometry gates

### G0 — Source integrity
HNK-derived constants are cited and not reinterpreted as canon.

### G1 — Graph completeness
Every playable square maps to exactly one graph node and every legal transition to an edge.

### G2 — Symmetry
Mirrored teams have equivalent baseline geometry.

### G3 — Simulation
Candidates A/B/C run under identical rules and RNG policies.

### G4 — Human playtest
Promising digital candidates are tested by people for readability, tension and tactical agency.

### G5 — Physical prototype
The selected graph is rendered at real dimensions and tested with actual pieces/dice.

### G6 — Geometry lock
Only after physical playtest does the board geometry become the manufacturing baseline.

## 11. Current decision

The current board artwork is a **visual geometry reference**, not yet a frozen movement graph.

We preserve its established identity:

- medieval Q'Worlox board;
- opposing team regions;
- upper/lower destinations;
- central region;
- double-lane corridor;
- heraldic blue/red identity.

But exact square counts, lane transitions, junctions and route lengths remain open to mathematical projection and simulation.

## 12. Next implementation artifact

Create a machine-readable `board.v1` graph containing Candidate A/B/C geometries. Then implement a headless simulator against the shared Game Core before producing the first polished digital board.
