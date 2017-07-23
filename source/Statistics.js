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
