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

let MAX_VELOCITY = 150;
