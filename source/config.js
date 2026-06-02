// Single source of truth for configuration settings
const CONFIG = {
    canvas: { width: 400, height: 300},

    lifespan: 400,

    population: {
        size: 25,
        mutationRate: 0.01,
        matingPoolScale:100,
    },

    rocket: {
        maxForce: 0.2,
        maxSpeed: 4,
        completionRadius: 10,
        completedFitnessBonus: 10,
        crashedFitnessPenalty: 10.0,
        body: { length: 25, width: 5 }
    },

    target: { y:50, diameter: 16 },

    obstacles: [
        { x: 100, y: 150, w: 200, h: 10 },
    ],

    stats: { warmupPopulations: 3 },
}

function validateConfig() {
    CONFIG.obstacles.forEach((o, i) => {
        ['x', 'y', 'w', 'h'].forEach(key => {
            if (typeof o[key] !== 'number') {
                throw new Error(
                    `CONFIG.obstacles[${i}] missing numeric "${key}": ${JSON.stringify(o)}`);
            }
        });
    });
}
