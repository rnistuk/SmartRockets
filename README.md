# SmartRockets

A genetic-algorithm sketch in which a population of rockets evolves, generation by
generation, to steer around an obstacle and reach a target. It's a refactor of
Daniel Shiffman's "Smart Rockets" coding challenge, restructured around a single
configuration source (`source/config.js`) and small, single-responsibility
modules. It runs entirely in the browser with [p5.js](https://p5js.org/) — there
is no build step.

## Getting Started

These instructions will get you a copy of the project running on your local
machine. The project is a set of static files; p5.js is loaded from a CDN, so
there are no dependencies to install and nothing to compile.

### Prerequisites

You need a modern web browser and any static web server. A simple option is
Python's built-in server, which ships with most systems:

```
python3 --version
```

### Installing

Clone the repository:

```
git clone https://github.com/rnistuk/SmartRockets.git
cd SmartRockets/source
```

Start a local web server from the `source` directory:

```
python3 -m http.server 8000
```

Open the sketch in your browser:

```
http://localhost:8000
```

You should see rockets launch from the bottom of the canvas. Over successive
generations they learn to steer around the bar and converge on the target circle,
while a readout reports the generation count and average draw time.

## Running the tests

There is no automated test suite yet; verification is a manual smoke check in the
browser.

### Break down into end to end tests

Load the sketch and watch several generations. Behavior is correct when:

* early generations scatter and crash into the obstacle,
* later generations visibly improve and an increasing share reach the target,
* the target circle and obstacle bar both render, and the stats readout updates
  without a growing stack of stale lines.

```
# no test runner configured — open source/index.html and observe
```

### And coding style tests

No linter or formatter is configured. The code targets browser-global p5.js
(ES6), favors small single-responsibility files, and keeps all tunable values in
`source/config.js`.

```
# no lint step configured
```

## Deployment

The project is fully static. Serve the contents of the `source/` directory from
any static host (GitHub Pages, Netlify, an S3 bucket, etc.) — no server-side
runtime or build is required.

## Built With

* [p5.js](https://p5js.org/) 2.0.5 - Rendering and creative-coding runtime (loaded via CDN; DOM helpers are part of core)
* Vanilla ES6 JavaScript - No framework, bundler, or build step

Project layout:

* `source/config.js` - Single source of truth for every tunable value
* `source/DNA.js` - Genome: gene initialization, crossover, mutation
* `source/Rocket.js` - One agent: physics, collision, fitness, rendering
* `source/Population.js` - A generation: evaluation, mating pool, selection
* `source/Statistics.js` - Running min/max/average accumulator
* `source/sketch.js` - p5 lifecycle, scene rendering, and HUD

## Contributing

Issues and pull requests are welcome. Please keep changes consistent with the
existing style: small, single-responsibility modules, with tunable values added
to `config.js` rather than hardcoded.

## Versioning

This project does not yet use formal versioning. If that changes, we will follow
[SemVer](http://semver.org/) and publish releases on the
[tags](https://github.com/rnistuk/SmartRockets/tags) page.

## Authors

* **Rich Nistuk** - *Refactor and maintenance* - [rnistuk](https://github.com/rnistuk)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md)
file for details.

## Acknowledgments

* [Daniel Shiffman](https://thecodingtrain.com/) - Original "Smart Rockets" tutorial
* [Coding Challenge #29: Smart Rockets](https://www.youtube.com/watch?v=bGz7mv2vD6g) - The video this project follows
* [Scott Burch](https://github.com/scottburch) - Functional-programming guidance
