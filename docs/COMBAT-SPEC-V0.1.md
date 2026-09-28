# Q'Worlox — Combat Resolution Spec v0.1

**Status:** EXPERIMENTAL / SIMULATION TARGET

This specification converts the discovered combat decisions into an executable design target. It does not lock final balance values.

## Combat pillars

A duel combines:

- Board position and territory;
- player decision through cards;
- one Common Die;
- optional Exclusive Dice;
- character attributes;
- equipment, allies and magic modifiers.

## Duel lifecycle

1. An opposing-character encounter is detected.
2. The engine snapshots relevant board/territory conditions.
3. Each player may select an eligible Combat card or other applicable card effect.
4. Selected combat cards are revealed simultaneously.
5. The Common Die is rolled once for the duel.
6. Each player may commit at most one Exclusive Die under the baseline rule.
7. Applicable attributes and modifiers are calculated.
8. Each side receives a final confrontation value.
9. Higher value wins; equal values produce a draw/impasse.
10. The winner receives the current movement advantage defined by the board rules; the loser is repositioned according to the graph.
11. The encounter closes as one atomic event.

## Baseline formula candidate

`confrontationValue = attribute + commonDie + exclusiveDie + cardModifier + boardModifier + equipmentModifier + allyModifier + magicModifier`

This is a **candidate formula**, not locked canon. A component is zero when absent.

## Attributes

Initial candidate set:

- Strength
- Defense
- Cunning

The relevant attribute may depend on the card/action rather than every duel automatically using the same attribute.

## Exclusive Dice

Exclusive Dice may originate from:

- character type;
- equipment;
- cards/magic;
- territory/position;
- allies.

Baseline: one Exclusive Die per player per duel. Effects may explicitly change this limit.

Exclusive Dice are strategic resources. Their exact persistence/consumption model remains unresolved.

## Draw

A draw does not create an automatic winner. The encounter remains unresolved by combat and proceeds according to an explicit draw rule to be selected during testing.

## Design constraints

- No cumulative HP.
- No permanent character elimination in the baseline.
- No hidden battle winner logic inside encounter detection.
- Combat must be deterministic under a supplied RNG seed.
- Physical and digital implementations must consume the same combat state and produce the same result.

## Required simulation metrics

- duel duration in actions;
- draw frequency;
- win-rate by character archetype;
- win-rate by first mover;
- average modifier contribution;
- exclusive-die usage rate;
- card usage rate;
- territory impact;
- comeback frequency.

## Open balance questions

- attribute scale;
- die sizes;
- exact card modifiers;
- exact board modifiers;
- exclusive-die consumption/recharge;
- draw resolution;
- exact loser repositioning;
- maximum modifiers per category.

These must remain EXPERIMENTAL until playtest evidence exists.
