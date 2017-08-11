function DNA(genes) {
    this.genes = !!genes ? genes : initializeGenes(lifespan);
    
    function initializeGenes(lifespan) {
        var genes = [];
        for( var i=0; i < lifespan; ++i) {
            genes[i] = p5.Vector.random2D();
            genes[i].setMag(maxForce);
        }
        return genes;
    }
    
    this.crossover = function (partner) {
        var newgenes = [new DNA()];
        var mid = floor(random(this.genes.length));
        newgenes = this.genes.map(
            (g,i) => (i>mid ? this.genes[i] : partner.genes[i]));
        return new DNA(newgenes);
    }
    
    this.mutation = function() {
        this.genes = this.genes.map((g) => {
            if(random(1) < 0.01) {
                g = p5.Vector.random2D();
                g.setMag(maxForce);
            }
            return g;
        });
    }
}
