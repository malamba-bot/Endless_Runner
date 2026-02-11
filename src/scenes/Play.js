class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    preload() {
        this.load.image('old_ball', './assets/old_ball.png');
        this.load.image('sky', './assets/sky.png');
    }

    create() {
        this.physics.world.setBounds(0, 0, width, height);
        // Add left and right controls to the input manager
        left = this.input.keyboard.addKey('A');
        right = this.input.keyboard.addKey('D');

        // Physics group for obstacles
        this.obstacles = this.physics.add.group({
            immovable: true,
        });

        // Add background tilesprite
        this.sky = this.add.tileSprite(0, 0, 480, 960, 'sky').setOrigin(0);
        // Scroll factor is how much a game object is displaced when the camera moves
        this.sky.setScrollFactor(0);

        // Add ball sprite
        this.ball = this.physics.add.sprite(200, 100, 'old_ball');
        this.ball.setCircle(this.ball.width / 2);
        this.ball.setGravityY(200);
        this.ball.body.setBounce(BOUNCE_FACTOR);
        this.ball.body.setMaxVelocityY(max_velocity);

        // Add side walls beyond camera so that the ball bounces of the sides
        this.left_boundry = this.add.rectangle(0, 0, 10, height).setOrigin(1, 0.5);
        this.right_boundry = this.add.rectangle(width, 0, 10, height).setOrigin(0, 0.5);
        this.obstacles.add(this.left_boundry); 
        this.obstacles.add(this.right_boundry); 

        // Add rectangle
        let size = Phaser.Math.Between(50, 100);
        this.obstacle = this.add.rectangle(
            Phaser.Math.Between(0, width - 50),
            height -200,
            size,
            100,
            0xFF0000
        ).setOrigin(0);
        this.obstacles.add(this.obstacle);

        // Stick camera to ball (only verically)
        this.cameras.main.startFollow(this.ball, true, 0, 1);
        this.cameras.main.setScroll(0, this.cameras.main.scrollY);

        // Collider for ball and obstacles
        this.physics.add.collider(this.ball, this.obstacles);
    }

    update() {
        // Scroll the background according to how much the camera has moved since game start
        this.sky.tilePositionY = this.cameras.main.scrollY;

        // Move the side boundries with the ball
        this.left_boundry.y = this.right_boundry.y = this.ball.y;

        // Burst movement: Set velocity high on tap, and quickly decay it
            if (Phaser.Input.Keyboard.JustDown(left)) {
                this.ball.setVelocityX(-MOVE_SPEED);
            } else if (Phaser.Input.Keyboard.JustDown(right)) {
                this.ball.setVelocityX(MOVE_SPEED);
            }

        this.ball.body.velocity.x *= DECAY;

        if (Math.abs(this.ball.body.velocity.x) < 5) {
            this.ball.setVelocityX(0);
        }

    }
}
