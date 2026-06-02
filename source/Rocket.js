function isOutOfBounds(pos) {
    return pos.x < 0 || pos.x > width || pos.y < 0  || pos.y > height;
}

function hitsAnyObstacle(pos) {
    return CONFIG.obstacles.some(o =>
        pos.x > o.x && pos.x < o.x + o.w &&
        pos.y > o.y && pos.y < o.y + o.h);
}

function Rocket(dna) {
    this.pos = createVector(width/2.0,height);
    this.vel = createVector();
    this.acc = createVector();
    this.completed = false;
    this.crashed =false;
    this.dna = dna || new DNA();
    this.fitness = 0;
    
    this.applyForce = function(force) {
        this.acc.add(force);
    }
    
    this.calcFitness = function() {
        const d = dist(this.pos.x, this.pos.y, target.x, target.y);
        this.fitness = map(d, 0, width, width,0);
        if (this.completed) this.fitness *= CONFIG.rocket.completedFitnessBonus;
        if (this.crashed) this.fitness /= CONFIG.rocket.crashedFitnessPenalty;
    }
    
    this.update = function() {
        const d = dist(this.pos.x, this.pos.y, target.x, target.y);
        if (d < CONFIG.rocket.completionRadius) {
            this.completed = true;
            this.pos = target;
        }

        if (isOutOfBounds(this.pos) || hitsAnyObstacle(this.pos)) {
            this.crashed = true;
        }

        this.applyForce(this.dna.genes[count]);
        if(!this.completed && !this.crashed) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
            this.vel.limit(CONFIG.rocket.maxSpeed);
        }
    }
    
    this.show = function() {
        push();
        noStroke();
        fill(255, 150);
        translate( this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        rectMode(CENTER);
        rect(0, 0, CONFIG.rocket.body.length, CONFIG.rocket.body.width);
        pop();
    }
}
