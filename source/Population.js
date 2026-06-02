function Population(size= CONFIG.population.size) {
    this.rockets = [];
    this.matingPool = [];
    
    for(let i = 0; i < size ; i++) {
        this.rockets[i] = new Rocket();
    }
    
    this.evaluate = function() {
        let maxFit;
        [this.rockets, maxFit ] = calculateFitnesses(this.rockets);
        this.rockets = normalizeFitnesses(this.rockets, maxFit);
        this.matingPool = createMatingPool(this.rockets);
        
        function calculateFitnesses(rockets) {
            let maxFit = 0;
            rockets = rockets.map( r => {
                r.calcFitness();
                maxFit = Math.max(maxFit,r.fitness);
                return r;
            });
            return [rockets, maxFit];
        }
        
        function normalizeFitnesses(rockets, maxFit) {
            return rockets.map(r => {
                r.fitness /= maxFit;
                return r;
            });
        }
        
        function createMatingPool(rockets) {
            var matingPool = [];
            rockets.forEach( rocket => {
                const copies = rocket.fitness * CONFIG.population.matingPoolScale;
                for (let j = 0 ; j < copies ; j++) {
                    matingPool.push(rocket);
                }
            });
            return matingPool;
        }
    }

    this.selection = function() {
        const newRockets = [];
        for (let i= 0 ; i < this.rockets.length; i++) {
            const parentA = random(this.matingPool).dna;
            const parentB = random(this.matingPool).dna;
            const child = parentA.crossover(parentB);
            child.mutation();
            newRockets[i] = new Rocket(child);
        }
        this.rockets = newRockets;
    }
    
    this.run = function () {
        let finished = 0;
        this.rockets.forEach(r => {
            r.update();
            r.show();
            finished += r.crashed || r.completed ? 1 : 0;
        });
        return finished;
    }
    
    this.size = function() { return this.rockets.length; }
}
