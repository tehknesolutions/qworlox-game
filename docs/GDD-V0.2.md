# Q'Worlox: Medieval Battle — GDD v0.2

**Status:** CONSOLIDATED DISCOVERY / ARCHITECTURE BASELINE  
**Repository:** `tehknesolutions/qworlox-game`  
**Product strategy:** physical-first, hybrid  
**Core principle:** physical and digital use the same Game Core and rules; digital is the first test laboratory.

## 1. Vision

Q'Worlox: Medieval Battle is a competitive medieval-fantasy territorial board game for two teams disputing the city of Q'Worlox.

Each team controls two characters. The first team to bring both characters to a valid upper destination wins.

The game combines three primary systems:

**Board + Cards + Dice**

The board establishes position and territory. Cards create tactical context and effects. Dice introduce controlled uncertainty.

## 2. Players and characters

- 2 opposing teams.
- 2 characters per team.
- 4 characters on the board.
- Initial character archetypes include Citizen and Cavalier/Knight.
- Character differences should create functional asymmetry rather than simple power hierarchy.
- Characters are not permanently eliminated in the baseline design.

## 3. Movement

The release mechanic is inspired by Ludo:

1. A character in base requires a **6** to enter play.
2. Once released, movement uses the movement die.
3. The player chooses which eligible character to move.
4. The turn then resolves board position, cards, encounters and other effects.

Exact turn sequencing remains subject to simulation/playtest.

## 4. Board and territory

The board contains:

- two lower starting areas;
- opposing routes;
- a double corridor;
- contested territory;
- a central shared area;
- upper destination areas.

The board is represented as a graph independently from artwork.

The double corridor is modeled as two explicit lanes. Lane changes occur only at graph-defined connections; visual adjacency does not automatically create a rule.

The central region is a contested strategic space. Its final number of physical nodes remains experimental.

## 5. HNK-MATH reference boundary

HNK Mandala research is used as a structural/mathematical reference.

Reference structures include:

- 72 sectors;
- 9 × 8 = 72;
- 6 × 72 = 432 regular fields;
- 3 + 7 + 12 = 22 central Rose fields;
- cyclic/angular and radial adjacency.

These structures are **not automatically Q'Worlox rules**.

Q'Worlox projections currently under simulation include route scales:

**72 → 36 → 18**

The final board geometry is selected only after graph validation, simulation and human/physical playtest.

## 6. Encounters

When opposing characters occupy the same contested node, the Game Core produces an **ENCOUNTER**.

Encounter detection does not itself determine the winner.

Allied characters on the same node do not automatically create a battle.

## 7. Combat

Combat is a complete one-encounter resolution. There is no cumulative HP system in the baseline.

The duel combines:

- common die;
- exclusive dice;
- attributes;
- cards;
- equipment;
- allies;
- magic;
- territory/position;
- player decisions.

Baseline combat flow:

**Encounter → conditions → card decision → reveal → common die → exclusive die choice → modifiers → resolution → consequence**

The common die is always part of the duel.

Exclusive dice are strategic resources. Baseline limit: up to one exclusive die per player per duel, unless an explicit effect changes the limit.

Candidate character attributes:

- Strength;
- Defense;
- Cunning.

These are design candidates, not yet locked numerical values.

Baseline consequence to test from GDD v0.1:

- winner advances one position;
- loser remains/repositions behind according to the board graph.

No permanent character elimination.

## 8. Cards

Q'Worlox has a shared central deck accessible to both teams.

Initial card families:

1. Combat
2. Territory
3. Event
4. Trap
5. Equipment
6. Character/Ally
7. Magic / medieval-fantasy effect

Card behavior depends on category and trigger.

Cards may be activated through:

- marked board spaces;
- regions;
- encounters;
- entering or conquering territory.

Experimental category behavior:

- Event: immediate resolution;
- Combat: normally held for tactical use;
- Equipment: attached to a character;
- Trap: placed on a legal board position/region;
- Territory: associated with a territory;
- Character/Ally: enters play;
- Magic: follows its specific effect.

Hand size and exact deck composition remain balance parameters.

## 9. Territory

Territory is a mechanical part of the game, not decoration.

Controlling territory may affect:

- card access;
- movement;
- modifiers;
- exclusive dice;
- allies;
- passage.

The shared center creates a natural confrontation point between both teams.

## 10. Turn architecture

Current experimental turn:

**Start → pending effects → release/movement dice → choose character → move → resolve space/region → card/encounter/combat → end turn**

The exact order is subject to testing.

## 11. Victory

The primary victory condition remains:

**both characters of one team reach a valid upper destination before the opposing team.**

Winning individual battles or controlling territory supports the objective but does not automatically replace it.

## 12. Game Core

The same Game Core must support both manifestations:

```
Q'WORLOX GAME CORE
├── Board Graph
├── Characters
├── Movement
├── Encounters
├── Combat
├── Dice
├── Cards
├── Territory
└── Victory
      ├── Headless Simulator
      ├── Digital Game
      └── Physical Board
```

The UI/artwork must render the rules; it must not become a second rules authority.

## 13. Development method

The repository separates:

- **DECIDED** — directly established decisions;
- **EXPERIMENTAL** — proposed mechanics awaiting evidence;
- **UNRESOLVED** — intentionally open questions;
- **CANON/APPROVED** — locked project decisions.

Pipeline:

**Discovery → Architecture → Game Core → Simulation → Digital Playtest → Physical Prototype → Geometry Lock → Production**

## 14. Current implementation state

Slice 01 is being developed on:

`feat/board-simulator-v1`

Current architectural artifacts include:

- board.v1 candidates: 18 / 36 / 72;
- deterministic seeded D6 RNG;
- minimal shared Game Core;
- headless simulator;
- comparative simulation runner;
- board graph;
- symmetric shared-center territory graph;
- encounter detection;
- TDD tests for the above layers.

Battle resolution, full card rules, class balancing and final physical geometry remain outside the locked baseline until tested.

## 15. Non-negotiable design principle

**Q'Worlox is one game, not a physical game plus a separate digital game.**

The digital implementation exists to test and validate the same rules that will ultimately govern the physical board.

The physical board remains the primary product manifestation.
