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
    
    lifeP.html(`Population: ${populationCount}   life count:${count}`);
    
    
    if (count === lifespan) {
        populationCount++;
        population.evaulate();
        population.selection();
        count = 0;
    }
    
    fill(255);
    rect(100,150, 200,10);
    ellipse(target.x, target.y,16,16);
    
    
    populationCount > 3 ? updatePerformanceStats(startTime) : drawTimeP.html("Ignoring stats for first 3 populations.");
    if(populationCount>3 && (populationCount % 10 === 0) && (count===0)) {
        const instantPerfStatP = createP();
        instantPerfStatP.html(reportDrawStats(drawStats));
        
    }
    
    function updatePerformanceStats(startTime) {
        drawStats.update((performance.now()) - startTime);
        drawTimeP.html(reportDrawStats(drawStats));
    }
    
    function reportDrawStats(drawStats) {
        return `Average draw time at population: ${populationCount} --  ${drawStats.ave().toFixed(2)}ms min:${drawStats.min.toFixed(2)}ms max:${drawStats.max.toFixed(2)}ms`;
        
    }
    
}

function Statistics() {
    this.count = 0;
    this.total = 0.0;
    this.min = 100000.0;
    this.max = 0.0;
    
    this.update = (v) => {
        this.total += v;
        this.count++;
        this.min = v < this.min ? v : this.min;
        this.max = v > this.max ? v : this.max;
    }
    this.ave = () => (this.total/this.count);
}

function Population() {
    
    this.rockets = [];
    this.popsize = 25;
    this.matingpool = [];
    
    for(var i = 0; i < this.popsize ; i++) {
        this.rockets[i] = new Rocket();
    }
    
    this.evaulate = function() {
        
        var maxfit =0;
        for (var i=0; i< this.popsize; ++i) {
            this.rockets[i].calcFitness();
            if(this.rockets[i].fitness > maxfit) {
                maxfit = this.rockets[i].fitness;
            }
        }
        
        for(var i = 0; i<this.popsize; ++i) {
            this.rockets[i].fitness /= maxfit;
        }
        
        this.matingpool = [];
        
        for(var i = 0; i<this.popsize; ++i) {
            var n = this.rockets[i].fitness * 100;
            for (var j =0; j<n; j++) {
                this.matingpool.push(this.rockets[i]);
            }
        }
    }
    
    this.selection = function() {
        var newRockets = [];
        for (var i=0 ; i < this.rockets.length; i++) {
            var parentA = random(this.matingpool).dna;
            var parentB = random(this.matingpool).dna;
            var child = parentA.crossover(parentB);
            child.mutation();
            newRockets[i] = new Rocket(child);
        }
        this.rockets = newRockets;
    }
    
    this.run = function () {
        for (var i = 0; i < this.popsize ; i++) {
            this.rockets[i].update();
            this.rockets[i].show();
        }
    }
}

function DNA(genes) {
    if(genes) {
        this.genes = genes;
    } else {
        this.genes = [];
        for( var i=0; i < lifespan; ++i) {
            this.genes[i] = p5.Vector.random2D();
            this.genes[i].setMag(maxForce);
        }
    }
    
    this.crossover = function (partner) {
        var newgenes = [new DNA()];
        var mid = floor(random(this.genes.length));
        for (var i= 0; i<this.genes.length; i++) {
            if(i>mid) {
                newgenes[i] = this.genes[i];
            } else {
                newgenes[i] = partner.genes[i];
            }
        }
        return new DNA(newgenes);
    }
    
    this.mutation = function() {
        for (var i=0; i< this.genes.length; ++i) {
            if(random(1) < 0.01) {
                this.genes[i] =p5.Vector.random2D();
                this.genes[i].setMag(maxForce);
            }
        }
    }
    
}

function Rocket(dna) {
    this.pos = createVector(width/2.0,height);
    this.vel = createVector();
    this.acc = createVector();
    this.completed = false;
    this.crashed =false;
    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }
    this.fitness = 0;
    
    this.applyForce = function(force) {
        this.acc.add(force);
    }
    
    this.calcFitness = function() {
        var d=dist(this.pos.x,this.pos.x, target.x, target.y);
        this.fitness = map(d, 0, width, width,0);
        if (this.completed) {
            this.fitness *= 10;
        }
        if (this.crashed) {
            this.fitness /= 10;
        }
    }
    
    this.update = function() {
        
        var d = dist(this.pos.x, this.pos.y, target.x, target.y);
        if (d<10) {
            this.completed = true;
            this.pos = target;
        }
        
        if(
            this.pos.x > rx && this.pos.x < rx + rw  && 
            this.pos.y > ry && this.pos.y < ry +rh) {
            this.crashed = true;
        }
        
        if(this.pos.x > width || this.pos.x < 0) {
            this.crashed = true;
        }
        
        if (this.pos.y > height || this.pos.y <0) {
            this.crashed =true;
        }
        
        this.applyForce(this.dna.genes[count]);
        if(!this.completed && !this.crashed) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
            this.vel.limit(4);
        }
    }
    
    this.show = function() {
        push();
        noStroke();
        fill(255, 150);
        translate( this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        rectMode(CENTER);
        rect(0, 0, 25, 5);
        pop();
    }
    
}


