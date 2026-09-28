# Q'Worlox: Medieval Battle — GDD v0.3

**Status:** CONSOLIDATED GDD / CANON + EXPERIMENTAL BOUNDARIES  
**Repository:** `tehknesolutions/qworlox-game`  
**Product strategy:** Physical First -> Hybrid Ready  
**Core principle:** one game, one Game Core, equivalent physical and digital rules.

## 1. Vision

Q'Worlox: Medieval Battle is a competitive medieval-fantasy territorial board game for two opposing teams disputing the city of Q'Worlox.

The fundamental objective is now **KING REACH**:

> Cross the map and reach the opposing King before the adversary reaches yours.

Structurally, the game has a Capture-the-Flag / Pique-Bandeira core: invade toward the opposing terminal objective while obstructing the enemy invasion.

Combat, territory, cards, dice, equipment, allies, traps and magic are tools for advancing toward the King or preventing the opponent from doing so. They are not automatic victory conditions by themselves.

## 2. Players and characters

- 2 opposing teams.
- 2 characters per team.
- 4 player characters on the board.
- Initial archetypes include Citizen and Cavalier/Knight.
- Character differences should create functional asymmetry rather than a simple power hierarchy.
- Permanent character elimination is not part of the baseline design.

**Experimental archetype direction:**
- Citizen: Cunning, territory and cards.
- Cavalier/Knight: Strength, combat and equipment.

Exact attributes and numerical balance remain subject to playtest.

## 3. Victory — KING REACH [CANON]

The King is the terminal strategic objective of each side.

Core victory direction:

`START -> traverse Q'Worlox -> penetrate opposing side -> opposing KING -> victory endpoint`

The previous GDD wording — bringing both characters to a valid upper destination — is superseded at the highest level by KING REACH.

Still unresolved and therefore not to be invented silently:
- whether one or both team characters must reach the opposing King;
- whether entering the King's node wins immediately;
- whether reaching the King triggers a final duel/capture resolution;
- exact King-node topology;
- exact-entry/overshoot rules at the King;
- how King defense interacts with territory, cards and combat.

Design filter for all mechanics:

`advance toward enemy King <-> obstruct enemy advance`

## 4. Core systems

The game combines three primary structural systems:

**Board + Cards + Dice**

The board establishes position, routes, territory and confrontation. Cards create tactical context and effects. Dice introduce controlled uncertainty. Player decisions determine how resources and routes are used.

## 5. Movement

The release mechanic is inspired by Ludo:

1. A character in base requires a **6** to enter play.
2. Once released, movement uses the movement die.
3. After the movement result is known, the player chooses which eligible character to move.
4. Movement resolves the destination node and any resulting board/card/encounter effects.

Current experimental turn architecture:

`Start -> pending effects -> release/movement roll -> choose character -> move -> LAND -> board/card/encounter/combat resolution -> end turn`

Exact sequencing remains a playtest parameter where not already enforced by the executable Game Core.

## 6. Board and territory

The board is represented as a graph independently from artwork.

Known structural elements:
- starting areas;
- opposing routes;
- double corridor / double lane;
- contested territories;
- central shared region;
- opposing destination/King side.

The double corridor uses explicit graph lanes. Lane changes occur only through graph-defined connections; visual adjacency does not automatically create movement permission.

The shared center is intended to create natural confrontation.

### Geometry research boundary

HNK-MATH Mandala structures are references, not automatic Q'Worlox rules. Research structures include 72 sectors, 9x8=72, 6x72=432 and 3+7+12=22. Route candidates 72 -> 36 -> 18 remain experimental until simulation and playtest select a useful geometry.

## 7. Territory

Territory is mechanical, not decorative.

Territory may affect:
- card access;
- movement/passage;
- modifiers;
- exclusive dice;
- allies;
- tactical route control.

Controlling territory does **not** automatically win the game. Territory exists to influence the race toward the opposing King.

## 8. Encounters

When opposing characters occupy the same contested node, the Game Core can produce an **ENCOUNTER**.

Each encounter is resolved as a complete unit rather than through cumulative HP:

`Encounter -> Duel -> Result -> Consequence -> game continues`

Allied characters sharing a node do not automatically create a battle.

## 9. Combat

Combat combines:

**Dice + Cards + Strategy/Attributes**

Known direction:
- one Common Die participates in the duel;
- Exclusive Dice can come from character, equipment, card/magic, territory or ally;
- baseline candidate: up to one Exclusive Die per player per duel unless an explicit effect changes the limit;
- candidate attributes: Strength, Defense, Cunning;
- no traditional cumulative HP baseline.

Current consequence candidate inherited from earlier GDD:
- winner advances one position;
- loser remains/repositions behind according to board geometry;
- ties may create an impasse.

These consequence details remain subject to playtest unless separately promoted to CANON.

## 10. Cards

Q'Worlox uses a shared central city deck accessible to both teams.

Seven card families are established:
1. Combat
2. Territory
3. Event
4. Trap
5. Equipment
6. Character/Ally
7. Magic / medieval-fantasy effect

Cards can be triggered by board context such as marked spaces, regions, encounters, and territory entry/conquest.

Experimental category behavior:
- Event: immediate resolution;
- Combat: held for tactical use;
- Equipment: attached to a character;
- Trap: placed on a legal board position/region;
- Territory: associated with territory;
- Character/Ally: enters play;
- Magic: follows its explicit effect.

Core relation:

`BOARD -> card context -> decision -> effect -> possible dice use`

Exact deck composition, hand size and individual card texts remain balance/content work.

## 11. Dice

Q'Worlox uses a Common Die and Exclusive Dice.

Exclusive Dice are strategic modifiers/resources rather than an automatic pile rolled every time. Exact faces, quantities, acquisition and refresh rules remain to be validated per system/card/character.

Movement/release dice and duel dice must remain explicit in rules and components so the physical game can reproduce the same logic as the digital Game Core.

## 12. Physical / digital parity [CANON]

Q'Worlox is one game, not a physical game plus a different digital adaptation.

`GAME CORE -> Physical Board + Digital Game + Headless Simulator`

The UI and artwork render rules; they do not become a second rules authority.

The physical board is the primary product manifestation. The digital version is the executable laboratory for simulation, balance and playtest.

## 13. Game Core architecture

```text
Q'WORLOX GAME CORE
├── Board Graph
│   ├── Nodes
│   ├── Edges
│   ├── Double Lanes
│   ├── Territories
│   ├── Center
│   └── King Objectives
├── Characters
├── Movement
├── Encounters
├── Combat
├── Dice
├── Cards
├── Territory
├── Victory / King Reach
└── Canonical Event Log
      ├── Replay
      ├── Headless Simulator
      ├── Digital Game
      └── Physical Match Recording
```

## 14. Canonical Event Log / replay

The digital architecture records observable domain events and reconstructs state deterministically from the canonical Event Log.

Current event vocabulary includes:
- ROLL
- MOVE
- LAND
- CARD_DRAWN
- TERRITORY_CONTROL_SET
- GAME_EVENT

Replay reconstructs recorded facts and validates causal integrity. It does not roll dice, draw random cards, recalculate movement legality or execute gameplay rules a second time.

The Event Log V1 transport envelope is:

```json
{
  "format": "qworlox-event-log",
  "version": 1,
  "events": []
}
```

This is the bridge for physical-match recording, portable files and deterministic digital replay.

## 15. Development method

Decision states:
- **DECIDED** — directly established by project authority;
- **EXPERIMENTAL** — proposed mechanic awaiting evidence;
- **UNRESOLVED** — intentionally open question;
- **CANON / APPROVED** — locked project decision.

Pipeline:

`Intention -> Discovery -> Architecture -> Game Core -> Simulation -> Digital Playtest -> Physical Prototype -> Refinement -> Geometry Lock -> Production`

Rules discovered in HNK or mathematical references do not automatically become Q'Worlox mechanics. They must cross the project decision/playtest boundary.

## 16. Current executable direction

Implemented architectural work includes:
- graph-based board model;
- deterministic seeded D6 infrastructure;
- movement and landing pipeline;
- board triggers;
- shared Card Engine boundary;
- territory-control domain events;
- deterministic Event Log;
- deterministic replay with causal validation;
- Event Log serialization/import V1 under active hardening;
- headless simulation foundations.

The next playable milestone must stop optimizing infrastructure in isolation and connect the smallest complete player-visible loop around KING REACH.

## 17. Playable-slice target

The first complete playable slice should prove this experience:

`two teams -> roll -> choose/move character -> LAND -> resolve encounter/effect -> alternate turns -> traverse contested map -> reach opposing King -> declare winner -> replay match`

The playable slice may use deliberately small content and provisional balance. It must not require the final art, final board geometry, full card library, full class system or production-ready physical components.

## 18. Open design questions

Priority questions now driven by KING REACH:
1. Does one character reaching the King win, or must both arrive?
2. Is King contact immediate victory or a final encounter/capture?
3. Can defenders occupy/block the King approach?
4. What happens on exact/overshoot movement at the King?
5. What is the smallest board graph that produces meaningful route choice and confrontation?
6. Which card families are necessary for the first playable slice?
7. Which territory effect creates meaningful defense without causing stalemate?
8. What duel consequence best supports the race rather than stopping it?

These questions are intentionally visible rather than silently resolved.