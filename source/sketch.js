var population;
var lifespan = 400;
var lifeP;
var drawTimeP;
var count = 0;
var populationCount = 0;
var target;
var maxForce = 0.2;

const drawStats = new Statistics();
const popStats = new Statistics(); 

var rx = 100;
var ry = 150;
var rw = 200;
var rh = 10;

function setup() {
    createCanvas( 400, 300);
    population = new Population();
    lifeP = createP();
    target = createVector( width/2, 50);
    drawTimeP = createP();
}

function draw() {
    const startTime = performance.now();
    
    background(0);
    population.run();
    count++;
    count === lifespan && resetPopulation();
    
    lifeP.html(`Population: ${populationCount}   life count:${count}`);
    
    drawTarget();
    drawObstacle();
    
    populationCount > 3 ? updatePerformanceStats(startTime) : drawTimeP.html("Ignoring stats for first 3 populations.");
    
    function drawTarget() {
        ellipse(target.x, target.y,16,16);
    }
    
    function drawObstacle() {
        rect(100,150, 200,10);
    }
    
    function resetPopulation() {
        populationCount++;
        population.evaulate();
        population.selection();
        count = 0;
    }
    
    function updatePerformanceStats(startTime) {
        drawStats.update((performance.now()) - startTime);
        drawTimeP.html(reportDrawStats(drawStats));
        if(populationCount>3 && (populationCount % 10 === 0) && (count===0)) {
            const instantPerfStatP = createP();
            instantPerfStatP.html(reportDrawStats(drawStats));
        }
    }
    
    function reportDrawStats(drawStats) {
        return `Population: ${populationCount} -- Ave. Draw Time: ${drawStats.ave().toFixed(2)}ms min:${drawStats.min.toFixed(2)}ms max:${drawStats.max.toFixed(2)}ms`;
    }
}
