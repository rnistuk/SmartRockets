function Statistics() {
    this.count = 0;
    this.total = 0.0;
    this.min = Number.POSITIVE_INFINITY;
    this.max = Number.MIN_VALUE;
    
    this.update = (v) => {
        this.total += v;
        this.count++;
        this.min = Math.min(v, this.min);
        this.max = Math.max(v, this.max);
    }
    this.ave = () => (this.total/this.count);
}
