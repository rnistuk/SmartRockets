SmartRockets — CLAUDE.md
============================

Genetic-algorithm rockets (p5.js) that evolve over generations to reach a target while
avoiding obstacles — a refactor of Daniel Shiffman's Smart Rockets tutorial. A learning
project for genetic algorithms, simple physics, and applying SOLID/DRY to a small p5
sketch, with an eye to embedding the visualization on the author's website.

Project Structure
-----------------

p5.js **global mode** — p5 globals (`createVector`, `dist`, `map`, `random`, `width`,
`height`, `p5.Vector`, …) are available everywhere. Scripts share state through
module-level globals and load in order via `source/index.html`. No build step.

| File | Responsibility |
| --- | --- |
| `source/config.js` | Single source of truth for all tunables + `validateConfig()` — loaded **first** |
| `source/DNA.js` | Genome: gene init, crossover, mutation |
| `source/Rocket.js` | One agent: physics, collision, fitness, rendering |
| `source/Population.js` | Generation: fitness eval, mating pool, selection, run |
| `source/Statistics.js` | Running min/max/avg accumulator |
| `source/sketch.js` | p5 lifecycle (`setup`/`draw`), scene rendering, HUD |

Environment
-----------

*   IDE: WebStorm (or any editor)
*   Language: JavaScript (browser, p5.js global mode)
*   Build system: none — static files served and run in a browser
*   Key dependencies: p5.js 2.0.5 (single script via CDN; `p5.dom` is now in core,
    `p5.sound` dropped as unused)

Building and Testing
--------------------

```
cd source
python -m http.server 8000
# open http://localhost:8000
```

No automated tests — verification is visual: rockets should learn to dodge the obstacle
and reach the target over generations, and the HUD should report sane stats.

Conventions
-----------

*   No comments unless the why is non-obvious
*   No speculative code — only implement what is needed right now
*   Commit messages: short, descriptive, imperative tense ("add efficiency bonus to fitness" not "added" or "adding")
*   `config.js` is the single source of truth — magic numbers go in `CONFIG`, guarded by
    `validateConfig()`; adding an obstacle should be a config-only change
*   p5 global mode: keep the load order in `index.html` correct (`config.js` first)
*   Build one small step at a time; for the GA, prefer test-driven order — get readouts
    on screen before changing `calcFitness`, since fitness changes alter evolution
*   Cosmetic tidy-ups (`var`→`const`/`let`) are fine but non-functional — don't bundle
    them into behaviour changes

Current State
-------------

### Completed

*   **Bug fixes** — `calcFitness` distance bug (was `dist(pos.x, pos.x, …)`); crossover
    throwaway-DNA allocation; DOM leak in stats (`<p>` per 10th population); `Statistics.max`
    seed (`MIN_VALUE` → `NEGATIVE_INFINITY`); `Population.evaulate` → `evaluate` typo.
*   **DRY** — obstacle defined once in `CONFIG.obstacles` (shared by collision + render);
    target hoisted to `CONFIG.target`; magic numbers moved into `CONFIG`.
*   **SOLID** — added `config.js` (`CONFIG` loaded first); SRP pass in `sketch.js`
    (`resetPopulation`, `drawTarget`, `drawObstacles`, `updateHud`, `reportDrawStats`;
    `draw()` is pure orchestration); OCP obstacles as a list, guarded by `validateConfig()`.
*   **Visual pass (committed)** — color theme in `CONFIG`, state-coded rockets
    (active/completed/crashed), triangle rocket + flickering flame, motion trails. Render
    layer only; GA untouched.
*   **Upgrade + housekeeping** — p5 0.5.11 → 2.0.5; `index.html` gained `lang`/`<title>`/
    `<meta charset>`; `LICENSE.md` (MIT, 2017-2026); README on the PurpleBooth template.

### In Progress

*   **HUD stats + path-efficiency fitness.** Replace the dev-facing draw-time HUD with
    meaningful GA stats first, then fold path efficiency into fitness. **Order matters:
    track + display before tuning fitness** (changing `calcFitness` alters evolution, so
    get readouts on screen first). Remaining Stats-HUD steps:
    *   Population ctor: `this.fitness = new Statistics()` (per-gen min/max/avg).
    *   `Population.evaluate()`: rebuild `this.fitness` from raw fitnesses (its `.max` also
        feeds normalization — one loop).
    *   Population: `counts()` → `{ hits, crashes, inFlight }` (live per frame).
    *   Rocket: `this.pathLength = 0`; in `update()` add `this.vel.mag()` after `pos.add(vel)`.
    *   Population: per-gen avg path length (second `Statistics`).
    *   sketch.js: rename `drawStats`→`bestFitnessStats`, `drawTimeP`→`statsP`;
        `resetPopulation()` updates all-time best; `updateHud()` shows gen/step + hits/
        crashes/flying, fitness best/avg/min + best-ever, avg path length (guard ±Inf/NaN
        for gen 0); drop `performance.now()` draw-timing; remove dead
        `stats.warmupPopulations` from config.
    *   Note: min fitness tends to ~0 (mutation yields an early crasher most gens); avg is
        the better convergence signal, max the headline — display all three.

### Next

*   **Path-efficiency fitness (after stats are visible)** — prefer short/direct *successful*
    paths WITHOUT punishing the detour the obstacle requires (⚠️ shortest path here is NOT a
    straight line; over-penalizing length fights the go-around → premature convergence).
    Make it `CONFIG`-weighted (e.g. `efficiencyWeight`), default gentle, tune against the
    live avg-path-length readout.
*   **Housekeeping (user-driven)** — save README/LICENSE/.gitignore; `git rm -r --cached
    addons/` so the `addons/` ignore takes effect (unused — p5 is CDN-loaded).
*   **Cosmetic** — remaining `var`→`const`/`let` tidy-ups (`Population.js`, `DNA.js`).
*   **Future (cross-file SRP)** — `count` is a global `Rocket.update` reads for gene
    indexing; consider passing the step in or having `Population` own it.

### Decisions Pending

*   **Path-efficiency fitness approach** — (1) efficiency bonus for finishers only
    (`completionBonus *= idealLen / pathLength`) — recommended, safest, preserves
    exploration; (2) speed-to-target bonus; (3) global mild length penalty (simplest,
    riskiest). Final choice TBD.

Do Not Touch
------------

*   The GA core (`DNA`, `Population` selection/mating, and especially `Rocket.calcFitness`)
    during visual/HUD work — changing fitness alters evolution, so it must be done
    deliberately and test-driven, not as a side effect of rendering changes.

Pair Programming
----------------

*   Driver writes all code — navigator (Claude) does not write code unless explicitly asked
*   Navigator provides: direction, design decisions, code review, and course corrections
*   One step at a time — navigator waits for driver to confirm before moving to the next
*   Navigator confirms tests pass before suggesting the next step
*   Navigation is terse — no lengthy explanations unless explicitly asked
*   If navigator disagrees with an approach, say so once then follow the driver's lead

Karpathy Rules
--------------

All rules apply to every task unless explicitly overridden.

### Rule 1 — Think Before Coding

State assumptions explicitly. If uncertain, ask rather than guess. Present multiple interpretations when ambiguity exists. Push back when a simpler approach exists. Stop when confused. Name what's unclear.

### Rule 2 — Simplicity First

Minimum code that solves the problem. Nothing speculative. No features beyond what was asked. No abstractions for single-use code. Test: would a senior engineer say this is overcomplicated? If yes, simplify.

### Rule 3 — Surgical Changes

The driver should touch only what is necessary to make the current test pass. Don't "improve" adjacent code, comments, or formatting. Don't refactor what isn't broken. Match existing style. Navigator warns the driver if this rule is being broken.

### Rule 4 — Agree on Done Before Starting

Before implementing anything, both driver and navigator should agree on what done looks like. A failing test is the preferred success criterion. Don't start until done is defined.

### Rule 5 — Dropped

Original rule was written for agentic coding and does not apply to this pair programming model.

### Rule 6 — Know When to Stop

If the session is getting long or context feels stale, checkpoint before continuing. Summarise what's done, what's verified, what's next. Update CLAUDE.md to reflect current state, then commit before ending the session. A fresh session with good context beats a stale one with accumulated confusion.

### Rule 7 — Surface Conflicts, Don't Average Them

If two patterns contradict, pick one (more recent / more tested). Explain why. Flag the other for cleanup. Don't blend conflicting patterns.

### Rule 8 — Read Before You Write

Before adding code, read exports, immediate callers, shared utilities. "Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

### Rule 9 — Test Behaviours, Not Functionality

Tests verify what the code does from the outside, not how it does it internally. Tests must encode WHY the behaviour matters, not just WHAT it does. A test that can't fail when business logic changes is wrong.

### Rule 10 — Checkpoint After Every Significant Step

Summarize what was done, what's verified, what's left. Don't continue from a state you can't describe back. If you lose track, stop and restate.

### Rule 11 — Match the Codebase's Conventions, Even If You Disagree

Conformance > taste inside the codebase. If you genuinely think a convention is harmful, surface it. Don't fork silently.

### Rule 12 — Fail Loud

"Completed" is wrong if anything was skipped silently. "Tests pass" is wrong if any were skipped. Default to surfacing uncertainty, not hiding it.
