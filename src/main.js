let config = {
    type: Phaser.WEBGL,
    width: 480,
    height: 960,
    physics: { 
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    scene: [Play],
    //pipeline: { 'water_prefx': Water_Pipeline },
}

let game = new Phaser.Game(config);

let { height, width } = game.config;

let left, right;
let max_velocity = 250;

const VELOCITY_MULTIPLIER = 1.25;
const BOUNCE_FACTOR = 0.8;
const MOVE_SPEED = 500;
const BALL_START_Y = 100;
const HARD_MAX_VELOCITY = 640;

// How fast burst movement decays
const DECAY = 0.92;

// Consts for col-row based spawning
const OBSTACLE_SIZE = 48;
const COLS = Math.round(width / OBSTACLE_SIZE);
const ROWS = Math.round(height / OBSTACLE_SIZE);
