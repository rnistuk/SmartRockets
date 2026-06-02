function DNA(genes) {
    this.genes = genes || Array.from({length:CONFIG.lifespan}, randomGene);

    function randomGene() {
        const g = p5.Vector.random2D();
        g.setMag(CONFIG.rocket.maxForce);
        return g;
    }
    
    this.crossover = function (partner) {
        var mid = floor(random(this.genes.length));
        const newgenes = this.genes.map(
            (g,i) => ( i > mid ? g : partner.genes[i]));
        return new DNA(newgenes);
    }
    
    this.mutation = function() {
        this.genes = this.genes.map( g =>
            random(1) < CONFIG.population.mutationRate ? randomGene() : g);
    }
}
