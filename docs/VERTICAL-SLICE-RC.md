# Q'Worlox — Vertical Slice Release Candidate Gate

## Canonical objective
Reach the opposing King at the end of the map before the opponent reaches yours.

## Included playable loop
- Blue and Red reserves.
- Explicit active-team character selection.
- D6 roll.
- Board-graph movement through legal highlighted nodes.
- North / Center / South route decisions.
- Turn alternation.
- Chronological Match Log.
- Contextual HOW TO WIN / WHAT TO DO NOW onboarding.
- KING_REACHED terminal victory.
- Post-victory interaction lock.
- Responsive layout and reduced-motion fallback.

## RC acceptance gates
- [x] Core objective represented in game rules and UI.
- [x] Presentation exposes active team, selection, D6 and movement state.
- [x] Legal route choices are explicit.
- [x] Victory has a terminal state.
- [x] Full-match automated contract exists.
- [x] Human-playtest onboarding contract exists.
- [ ] Automated suite executes successfully in CI.
- [ ] Browser build is deployed or otherwise opened as a runnable artifact.
- [ ] Human start-to-finish playtest is recorded.
- [ ] Any blocking usability defects found by the playtest are fixed.

## Release rule
Do not call the vertical slice RELEASED while any unchecked gate above remains. Static review is not a substitute for executable verification.

## Current infrastructure blocker
GitHub Actions jobs have been failing before workflow steps execute. Vercel accounts were inspected and no existing Q'Worlox project was found; connector deployment was unavailable during the deployment attempt. These are delivery/infrastructure blockers, not evidence of gameplay failure.

## Next execution path
1. Restore any executable path: CI runner, local/browser artifact, or hosting deployment.
2. Run the automated contracts.
3. Run the human playtest checklist from start to KING_REACHED.
4. Record defects and patch only blockers to comprehension or completion.
5. Re-run gates and promote to Vertical Slice RC only with evidence.