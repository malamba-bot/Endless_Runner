let config = {
    type: Phaser.AUTO,
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
    scene: [Play]
}

let game = new Phaser.Game(config);

let { height, width } = game.config;

let left, right;

let max_velocity = 150;
const BOUNCE_FACTOR = 0.8;
const MOVE_SPEED = 500;
// How burst movement decays
const DECAY = 0.92;
