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
        body: { length: 16, width: 9 }
    },

    target: { y:50, diameter: 16 },

    obstacles: [
        { x: 100, y: 150, w: 200, h: 10 },
    ],

    stats: { warmupPopulations: 3 },

    theme: {
        background:      [11, 19, 43],          // deep navy
        target:          [126, 255, 165],       // green  — the goal
        obstacle:        [255, 110, 90],         // warm red — the hazard
        rocketActive:    [125, 200, 255, 110],   // translucent cyan — in flight
        rocketCompleted: [126, 255, 165, 220],   // green — reached target
        rocketCrashed:   [255, 110, 90, 70],     // dim red — crashed
        flame:           [255, 190, 80, 180],
        trailFade:       35,
    },
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
