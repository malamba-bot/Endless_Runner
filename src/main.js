let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: { 
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    scene: [Play]
}

let game = new Phaser.Game(config);
