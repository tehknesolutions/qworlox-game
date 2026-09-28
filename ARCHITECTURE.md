# Q'Worlox: Medieval Battle — Target Architecture v1

## 1. Architectural thesis

**Physical First → Hybrid Ready → Digital Optional**

Q'Worlox: Medieval Battle is first a physical board game. The physical ruleset and physical components must be sufficient to play a complete match without an app, account, network connection, or digital runtime.

The digital layer is an adapter over the game model, never the authority over the physical product.

## 2. Architecture goals

1. Keep the physical product independently playable.
2. Separate game rules from presentation and implementation.
3. Make rules explicit enough to simulate and test later.
4. Separate stable decisions from experimental playtest rules.
5. Allow future content packs and expansions without rewriting the core.
6. Preserve a clean boundary between physical assets and generated/digital representations.

## 3. Layers

### 3.1 Physical Product

Source of truth for the manufactured experience:

- board geometry and dimensions;
- pieces / miniatures;
- dice;
- printed rulebook;
- cards/tokens if introduced;
- packaging;
- print/manufacturing specifications;
- physical prototype revisions.

Target path: `physical/`

### 3.2 Game Domain

Implementation-independent model of the rules:

- match state;
- teams;
- characters;
- board positions;
- entry from base;
- movement;
- encounters;
- battles;
- arrival zones;
- victory conditions;
- turn state machine;
- invariants.

Target path: `game/`

The domain must not depend on a browser, UI framework, database, or rendering engine.

### 3.3 Contracts

Stable vocabulary and interfaces shared by physical documentation, simulation and future digital adapters.

Examples:

- `Board`
- `Tile`
- `Lane`
- `Team`
- `Character`
- `Turn`
- `Move`
- `Battle`
- `GameState`
- `VictoryState`

Target path: `contracts/`

### 3.4 Schemas

Machine-validatable representation for structured game data and future content packs.

Target path: `schemas/`

### 3.5 Content Packs

Content that can vary while preserving the core rules:

- factions;
- character sets;
- scenarios;
- alternate boards;
- expansions;
- optional rule variants.

Target path: `packs/`

No expansion should silently mutate the base ruleset.

### 3.6 Assets

Canonical creative assets for the product:

- board artwork;
- character/miniature concepts;
- heraldry;
- icons;
- branding;
- packaging art.

Target path: `assets/`

Generated runtime copies must not replace canonical source assets.

### 3.7 Playtest & Simulation

Evidence-producing layer:

- physical playtest records;
- balance observations;
- rule experiments;
- deterministic simulations when possible;
- regression tests for established invariants.

Target paths: `playtests/`, `tests/`, `simulation/`.

### 3.8 Hybrid Adapters

Optional capabilities built over the same domain model:

- companion app;
- interactive rules/tutorial;
- match tracker;
- playtest telemetry;
- digital board representation;
- full digital edition if later desired.

Target path: `hybrid/`.

A hybrid adapter may assist a match but the base physical game must not require it.

## 4. Current domain baseline

Currently established product facts:

- title: **Q'Worlox: Medieval Battle**;
- setting: medieval city of Q'Worlox;
- two competing teams;
- two characters per team;
- four characters total;
- Citizen and Knight/Gentleman archetypes are under development;
- a character requires a roll of 6 to leave its starting area;
- movement uses a die/result separate from the entry concept;
- after seeing the movement result, the player chooses which eligible character to move;
- the board includes a double-lane corridor;
- victory requires bringing both team characters to a valid upper destination;
- battle details remain experimental.

## 5. Rule maturity

Use three practical states during development:

- **DEFINED** — explicitly decided for the project.
- **EXPERIMENTAL** — candidate rule intended for prototype/playtest.
- **VALIDATED** — survived defined playtest criteria and is ready for the rulebook baseline.

Do not promote an experimental rule merely because it appears in a prototype or implementation.

## 6. Physical/digital authority boundary

The physical ruleset owns the meaning of the base game.

A digital implementation must reproduce the same domain rules unless it explicitly declares a digital-only variant.

Therefore:

`Physical Rules → Game Domain → Hybrid/Digital Adapter`

not:

`App Code → Physical Rules`

## 7. Asset boundary

Physical production assets and digital runtime assets have different requirements.

A Citizen concept, for example, can produce:

`canonical character concept → miniature/token production asset → optional digital representation`

The digital representation is derived; it must not redefine the physical character.

## 8. Proposed repository topology

```text
qworlox-game/
├─ README.md
├─ ARCHITECTURE.md
├─ docs/
│  ├─ GDD.md
│  ├─ RULEBOOK.md
│  ├─ ART-DIRECTION.md
│  ├─ GAME-DOMAIN.md
│  ├─ PHYSICAL-SYSTEM.md
│  └─ HYBRID-BOUNDARY.md
├─ physical/
│  ├─ board/
│  ├─ pieces/
│  ├─ dice/
│  ├─ print/
│  ├─ packaging/
│  └─ prototypes/
├─ assets/
│  ├─ board/
│  ├─ characters/
│  ├─ heraldry/
│  ├─ icons/
│  └─ branding/
├─ game/
│  ├─ state/
│  ├─ rules/
│  ├─ movement/
│  ├─ battle/
│  └─ victory/
├─ contracts/
├─ schemas/
├─ packs/
│  └─ core/
├─ playtests/
├─ simulation/
├─ tests/
└─ hybrid/
```

Directories should be materialized only when their first real artifact exists; this tree is the target architecture, not a requirement to create empty folders.

## 9. Architectural invariants

1. A complete base match is playable physically without digital support.
2. UI/rendering cannot own core rule logic.
3. Experimental rules remain distinguishable from validated rules.
4. A derived asset cannot silently become the canonical source asset.
5. Content packs extend the core; they do not silently rewrite it.
6. Future simulations implement the domain model rather than inventing a parallel ruleset.
7. Physical and digital editions share vocabulary and contracts wherever their rules are equivalent.

## 10. Immediate architecture sequence

1. Formalize `GAME-DOMAIN.md`.
2. Formalize `PHYSICAL-SYSTEM.md`.
3. Formalize `HYBRID-BOUNDARY.md`.
4. Convert the current GDD uncertainties into explicit experimental rules.
5. Build a paper/print prototype specification.
6. Run playtests before locking combat and class abilities.
7. Only then materialize simulation or companion-app code.

## 11. Reference architecture principle

The wider Tehkné/HNK repositories are architectural references only. Q'Worlox remains autonomous and does not modify or depend operationally on those repositories.

A useful pattern observed in the HNK RPG architecture is the explicit separation between world/game state and rendering, plus a boundary between canonical assets and generated runtime mirrors. Q'Worlox adapts that principle to a physical-first board game: game meaning is separated from representation, and canonical physical/creative assets are separated from future digital derivatives.
