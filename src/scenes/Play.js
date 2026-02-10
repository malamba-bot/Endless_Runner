/* Infinite scrolling technique:
    *  - The ball actually falls through game space so that it can take advantage of built-in physics
    *  functionality like gravity and bounce.
    *  - The background sprite is locked to the camera using 0 scrollfactor.
    *  - The background is a scrolling tilesprite.
    */ 
class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    preload() {
        this.load.image('old_ball', './assets/old_ball.png');
        this.load.image('sky', './assets/sky.png');
    }

    create() {
        // Physics group for obstacles
        this.obstacles = this.physics.add.group({
            immovable: true,
        });

        // Add background tilesprite
        this.sky = this.add.tileSprite(0, 0, 480, 960, 'sky').setOrigin(0);
        // Scroll factor is how much a game object is displaced when the camera moves.
        this.sky.setScrollFactor(0);
        // Add ball sprite
        this.ball = this.physics.add.sprite(200, 100, 'old_ball');
        this.ball.setCircle(this.ball.width / 2);
        this.ball.setGravityY(200);
        this.ball.body.setBounce(0.5);
        this.ball.body.setMaxVelocityY(MAX_VELOCITY);

        // Add rectangle
        let size = Phaser.Math.Between(50, 100);
        this.obstacle = this.add.rectangle(
            Phaser.Math.Between(0, width - 50),
            height -200,
            size,
            10,
            0xFF0000
        ).setOrigin(0);
        this.obstacles.add(this.obstacle);

        // Stick camera to ball
        this.cameras.main.startFollow(this.ball);

        // Collider for ball and obstacles
        this.physics.add.collider(this.ball, this.obstacles);
    }

    update() {
        // Scroll the background according to how much the camera has moved since game start
        this.sky.tilePositionY = this.cameras.main.scrollY;
    }

}
