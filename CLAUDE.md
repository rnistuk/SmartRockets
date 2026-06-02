# SmartRockets

Genetic-algorithm rockets (p5.js) that evolve over generations to reach a target
while avoiding obstacles. A refactor of Daniel Shiffman's Smart Rockets tutorial.

## Architecture

p5.js **global mode** — p5 globals (`createVector`, `dist`, `map`, `random`,
`width`, `height`, `p5.Vector`, ...) are available everywhere. Scripts share state
through module-level globals and load in order via `source/index.html`.

| File | Responsibility |
| --- | --- |
| `source/config.js` | Single source of truth for all tunables + `validateConfig()` |
| `source/DNA.js` | Genome: gene init, crossover, mutation |
| `source/Rocket.js` | One agent: physics, collision, fitness, rendering |
| `source/Population.js` | Generation: fitness eval, mating pool, selection, run |
| `source/Statistics.js` | Running min/max/avg accumulator |
| `source/sketch.js` | p5 lifecycle (`setup`/`draw`), scene rendering, HUD |

## Run

```bash
cd source
python -m http.server 8000
# open http://localhost:8000
```

---

## Refactor checklist (SOLID / DRY / bugfix)

Tracking the agreed plan. Check items off as completed.

### Bugs (behavior-affecting)
- [x] **calcFitness distance** — `Rocket.js:16` passes `this.pos.x` twice:
      `dist(this.pos.x, this.pos.x, target.x, target.y)` → should be `pos.x, pos.y`.
      ✅ Fixed; rockets now visibly learn to dodge the obstacle.
- [x] **crossover throwaway DNA** — `DNA.js:14` `var newgenes = [new DNA()];`
      allocates 400 random genes then overwrites them. Drop the initializer;
      `const newgenes = this.genes.map(...)`. ✅ Also extracted a `randomGene()`
      helper (DRY) shared by gene init + mutation.
- [x] **DOM leak in stats** — `sketch.js` `updatePerformanceStats` created a
      new `<p>` every 10th population forever. ✅ Block removed in the SRP refactor;
      the rolling stats now reuse the single `drawTimeP` element.
- [x] **Statistics.max init** — `Statistics.js:5` was `Number.MIN_VALUE` (smallest
      positive float). ✅ Now `Number.NEGATIVE_INFINITY`, symmetric with the
      `min`/`POSITIVE_INFINITY` seed above it.
- [x] **Typo** — `Population.evaulate` → `evaluate` (rename def + call at `sketch.js:50`). ✅

### DRY
- [x] **Obstacle defined twice** — was both `rx/ry/rw/rh` (collision) and a hardcoded
      `rect(...)` (draw). ✅ Collapsed into `CONFIG.obstacles`; `hitsAnyObstacle`
      (collision) and `drawObstacles` (render) both iterate the same list.
- [x] **Target hardcoded** — was duplicated across `setup`, `drawTarget`, and the
      completion check. ✅ Now `CONFIG.target` (y + diameter) with x centered in
      `setup`; arrival uses `CONFIG.rocket.completionRadius`.
- [x] **Magic numbers** — ✅ moved to `CONFIG`: mutation rate, max force, lifespan
      (DNA); fitness bonus/penalty, max speed, completion radius, body size (Rocket);
      size, mating-pool scale (Population); canvas, warmup count (sketch).

### SOLID
- [x] **Add `config.js`** — `CONFIG` object: canvas, lifespan, population
      (size, mutationRate, matingPoolScale), rocket (maxForce, maxSpeed,
      completionRadius, fitness bonus/penalty, `body: {length, width}`), target
      (y + diameter, x centered at runtime), `obstacles` array. Loaded **first**
      in `index.html`. ✅ wired into index.html.
- [x] **SRP in sketch.js** — ✅ helpers (`resetPopulation`, `drawTarget`,
      `drawObstacles`, `updateHud`, `reportDrawStats`) lifted to module scope, one
      job each; `draw()` is pure orchestration. Dropped unused `popStats`, dead
      `maxForce`/`rx/ry/rw/rh` globals, and the duplicate `lifespan` global.
- [x] **OCP for obstacles** — ✅ `CONFIG.obstacles` is a list; `hitsAnyObstacle`
      and `drawObstacles` both `forEach` over it. Adding an obstacle is a config-only
      change. Guarded by `validateConfig()`.

### Docs / housekeeping
- [x] **README.md** — ✅ rewritten on the PurpleBooth template (config.js as single
      source, module layout, p5 2.0.5 / DOM-in-core); replaced the old overview README.
- [x] **LICENSE.md** — ✅ MIT license added (2017-2026), linked from README.
- [x] **.gitignore** (repo root) — ✅ `.DS_Store`, `.idea/`, editors, `addons/`.
      NOTE: first version had leading whitespace on every line (silently matched
      nothing); fixed + verified `.idea/`/`.DS_Store` now ignored. Commit pending.
- [x] **Untrack `.idea/`** — N/A: `.idea/` and `.DS_Store` were untracked (`??`),
      never committed, so `.gitignore` alone suffices — no `git rm --cached` needed.

### Done beyond the original plan
- ✅ `validateConfig()` guard (fail fast on malformed obstacle config).
- ✅ Upgraded p5 0.5.11 → **2.0.5** (single script; `p5.dom` now in core, `p5.sound`
  dropped as unused). `index.html` also got `lang`, `<title>`, `<meta charset>`.
- ✅ `LICENSE.md` (MIT, 2017-2026) + README on the PurpleBooth template.

### Still open
- **Housekeeping (user-driven):** save README/LICENSE/.gitignore; run
  `git rm -r --cached addons/` to make the `addons/` ignore take effect (they're
  unused — p5 is CDN-loaded).
- **Cosmetic:** a few `var`→`const`/`let` tidy-ups remain (e.g. `Population.js`
  `var matingPool`/`var j`, `DNA.js` `var mid`). Non-functional.
- **Future (cross-file SRP):** `count` is a global `Rocket.update` reads for gene
  indexing — consider passing the step in or having `Population` own it.
