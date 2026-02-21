/*    Name: Max Kinet
    * Title: Infinite Fishing
    * Approximate time spent: 45 hours
    * Sources: No source code was directly copied from anywhere other than
    * Phaser docs
    * Creative tilt justification: I tried to give the game a hand-painted
    * look by hand-drawing all the assets and I simulated an underwater enviornment by writing a custom
    * fragment shader(pain) that warps the background image, making it look like
    * waves are passing.
    *
    * Notes: On the technical side, I was pretty happy with my procedural
    * generation of obstacles which uses chunking, and the custom shader I
    * wrote. I provided explanations of both with lots of comments in their
    * respective sections.
    *
    * Additionally, the infinite scrolling is done inside of the shader (see
    * more in the shader class)
    */
let config = {
    type: Phaser.WEBGL,
    width: 480,
    height: 960,
    physics: { 
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    scene: [Menu, Play, Credits],
}

let game = new Phaser.Game(config);

let { height, width } = game.config;

let left, right, space, c_key;
let max_velocity;

let high_score = 0;

const VELOCITY_MULTIPLIER = 1.25;
const BOUNCE_FACTOR = 0.8;
const MOVE_SPEED = 500;
const HOOK_START_Y = 100;
const HARD_MAX_VELOCITY = 640;

// How fast burst movement decays
const DECAY = 0.92;

// Consts for col-row based spawning
const OBSTACLE_SIZE = 48;
const COLS = Math.round(width / OBSTACLE_SIZE);
const ROWS = Math.round(height / OBSTACLE_SIZE);
