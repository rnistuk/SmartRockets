let population;
let target;
let count = 0;            // current step within a generation; indexes each rocket's genes
let populationCount = 0;  // generations elapsed so far

let lifeP;       // DOM readout: generation + life-step
let drawTimeP;   // DOM readout: draw-time stats

const drawStats = new Statistics();

function setup() {
    validateConfig();
    createCanvas( CONFIG.canvas.width, CONFIG.canvas.height);
    population = new Population();
    target = createVector( width/2, CONFIG.target.y);
    lifeP = createP();
    drawTimeP = createP();
}

function resetPopulation() {
    populationCount++;
    population.evaluate();
    population.selection();
    count = 0;
}

function drawTarget() {
    ellipse(target.x, target.y, CONFIG.target.diameter, CONFIG.target.diameter);
}

function drawObstacles() {
    CONFIG.obstacles.forEach(o => rect(o.x, o.y, o.w, o.h));
}

function updateHud(startTime) {
    lifeP.html(`Population: ${populationCount}   life count: ${count}`);

    if (populationCount > CONFIG.stats.warmupPopulations) {
        drawStats.update(performance.now() - startTime);
        drawTimeP.html(reportDrawStats());
    } else {
        drawTimeP.html(`Ignoring stats for first ${CONFIG.stats.warmupPopulations} populations.`);
    }
}

function reportDrawStats() {
    return `Population: ${populationCount} -- Ave. Draw Time: `
        + `${drawStats.ave().toFixed(2)}ms `
        + `min:${drawStats.min.toFixed(2)}ms max:${drawStats.max.toFixed(2)}ms`;
}

function draw() {
    const startTime = performance.now();

    background(0);
    const finishedCount = population.run();
    count++;

    if (count === CONFIG.lifespan || finishedCount === population.size()) {
        resetPopulation();
    }

    drawTarget();
    drawObstacles();
    updateHud(startTime);
}
