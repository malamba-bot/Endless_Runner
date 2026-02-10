class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    preload() {
       this.load.image('old_ball', './assets/old_ball.png');
    }

    create() {
        // Add ball sprite
        this.ball = this.physics.add.sprite(200, 100, 'old_ball');
        this.ball.setCircle(this.ball.width / 2);
        this.ball.setGravityY(200);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);

        // Add rectangle
        let size = Phaser.Math.Between(50, 100);
        this.obstacle = this.add.rectangle(
            Phaser.Math.Between(0, width - 50),
            20,
            size,
            height - 100,
            '#FF0000'
        ).setOrigin(0);


        // Stick camera to ball
        this.cameras.main.startFollow(this.ball);
    }

    update() {
        if (this.ball.body.blocked.down) {
            this.tweens.add({
                targets: this.ball,
                scaleX: 1.3,    // Wider
                scaleY: 0.7,    // Flatter
                duration: 200,
                yoyo: true,     // Automatically bounces back to original scale
                ease: 'Quad.easeOut',

            });

        }

    }

}
