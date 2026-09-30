# P5 Structural Status

The structural diagnostic now distinguishes three states:

- `UNCHANGED` — current metrics match the comparison baseline.
- `CHANGED` — metrics changed, but the structural contract remains valid.
- `BREAKING` — the structural baseline contract is invalid or a previously tracked cell was removed.

A metric change is **not** automatically a gameplay defect. It is evidence that the board geometry changed and should be reviewed before accepting a new baseline.

This layer deliberately does not assign balance quality, strategic value, or a winner.

CI remains `CI_INFRA_BLOCKED` until GitHub Actions executes the repository jobs successfully.
