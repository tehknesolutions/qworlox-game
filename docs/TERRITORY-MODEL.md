# Q'Worlox — Territory Model v0.1

**Status:** EXPERIMENTAL — requires simulation and human playtest.

Q'Worlox is a dispute for the city, so the movement graph must create shared contested space rather than two independent races.

## Current hypothesis

For the 18/36/72 geometry experiments, each side receives a mirrored approach of `routeLength / 2` nodes toward one shared `CENTER` node.

```text
BLUE ENTRY -> blue approach -> CENTER -> red-facing approach -> RED UPPER TERRITORY
RED ENTRY  -> red approach  -> CENTER -> blue-facing approach -> BLUE UPPER TERRITORY
```

This makes the center a topological convergence point and guarantees equal baseline distance under mirrored geometry.

## Important boundary

This is a Q'Worlox game-design hypothesis. It is **not** asserted as HNK Mandala canon.

The HNK Mandala remains the mathematical reference for the 72 / 9×8 / 6×72 / 3+7+12 structures. The exact mapping from those structures into Q'Worlox movement and conflict remains subject to simulation.

## Still unresolved

- whether the center is one physical square or a multi-node region;
- whether pieces can share the center;
- whether entering the center forces battle;
- exact meaning of the two upper areas;
- whether a team captures the opponent-facing territory or reaches a neutral upper goal;
- where lane changes exist in the double corridor;
- battle resolution;
- Citizen and Cavalier/Knight differences.

No unresolved item should be silently encoded as a final rule.
