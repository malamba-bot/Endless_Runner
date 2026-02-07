class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    preload() {
       this.load.image('ball', './assets/ball.png');
       this.load.image('old_ball', './assets/old_ball.png');
    }

    create() {
        this.ball = this.physics.add.sprite(100, 100, 'ball');
        this.ball.setCircle(this.ball.width / 2);
        this.ball.setGravityY(100);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);

        this.old_ball = this.physics.add.sprite(200, 100, 'old_ball');
        this.old_ball.setCircle(this.old_ball.width / 2);
        this.old_ball.setGravityY(200);
        this.old_ball.body.setCollideWorldBounds(true);
        this.old_ball.body.setBounce(0.5);
        this.squash = this.tweens.add({
            targets: this.ball,
            scaleX: 1.3,    // Wider
            scaleY: 0.7,    // Flatter
            duration: 200,
            yoyo: true,     // Automatically bounces back to original scale
            ease: 'Quad.easeOut',
            paused: true

        });

        this.cameras.main.startFollow(this.old_ball);
    }

    update() {
        if (this.old_ball.body.blocked.down || this.ball.body.blocked.down) {
            this.tweens.add({
                targets: this.ball,
                scaleX: 1.3,    // Wider
                scaleY: 0.7,    // Flatter
                duration: 100,
                yoyo: true,     // Automatically bounces back to original scale
                ease: 'Quad.easeOut',

        });
            this.tweens.add({
                targets: this.old_ball,
                scaleX: 1.3,    // Wider
                scaleY: 0.7,    // Flatter
                duration: 200,
                yoyo: true,     // Automatically bounces back to original scale
                ease: 'Quad.easeOut',

        });

        }

    }

}
