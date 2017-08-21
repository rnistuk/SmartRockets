function Population(size=25) {
    this.rockets = [];
    this.matingpool = [];
    
    for(var i = 0; i < size ; i++) {
        this.rockets[i] = new Rocket();
    }
    
    this.evaulate = function() {
        var maxfit = 0;
        
        [this.rockets, maxfit] = calculateFitnesses(this.rockets);
        this.rockets = normalizeFitnesses(this.rockets, maxfit);
        this.matingpool = createMatingPool(this.rockets);
        
        function calculateFitnesses(rockets) {
            var maxfit = 0;
            rockets = rockets.map( r => {
                r.calcFitness();
                maxfit = Math.max(maxfit,r.fitness);
                return r;
            });
            return [rockets, maxfit];
        }
        
        function normalizeFitnesses(rockets, maxfit) {
            return rockets.map(r => {
                r.fitness /= maxfit;
                return r;
            });
        }
        
        function createMatingPool(rockets) {
            var matingPool = [];
            rockets.forEach(rocket => {
                for(var j = 0; j< rocket.fitness * 100; j++) {
                    matingPool.push(rocket);
                }
            });
            return matingPool;
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
        var finished = 0;
        this.rockets.forEach((r) => {
            r.update();
            r.show();
            finished += r.crashed || r.completed ? 1 : 0;
        });
        return finished;
    }
    
    this.size = function() { return this.rockets.length; }
}
