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

        translate( this.pos.x, this.pos.y);
        rotate(this.vel.heading());

        const len = CONFIG.rocket.body.length;
        const w = CONFIG.rocket.body.width;

        if (!this.completed && !this.crashed) {
            const flame = len * (0.5 + random(0.5));   // flicker each frame
            fill(...CONFIG.theme.flame);
            triangle(-len / 2, -w / 4,
                -len / 2,  w / 4,
                -len / 2 - flame, 0);
        }

        if (this.completed)    fill(...CONFIG.theme.rocketCompleted);
        else if (this.crashed) fill(...CONFIG.theme.rocketCrashed);
        else                   fill(...CONFIG.theme.rocketActive);

        triangle(len / 2, 0,        // nose (front, points along travel)
            -len / 2, -w / 2,   // back-left
            -len / 2,  w / 2);  // back-right

        pop();
    };
}
