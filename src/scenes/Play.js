class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    preload() {
        this.load.image('old_ball', './assets/old_ball.png');
        this.load.image('sky', './assets/sky.png');
        this.load.image('spikey_ball', './assets/spikey_ball.png');
        this.load.image('platform', './assets/platform.png');
    }

    create() {
        // Add left and right controls to the input manager
        left = this.input.keyboard.addKey('A');
        right = this.input.keyboard.addKey('D');

        // Physics group for obstacles
        this.platforms = this.physics.add.group({ immovable: true });
        this.spikeys = this.physics.add.group();

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
        this.platforms.add(this.left_boundry); 
        this.platforms.add(this.right_boundry); 

        this.spawn_obstacles();

        // Stick camera to ball (only verically)
        this.cameras.main.startFollow(this.ball, true, 0, 1);
        this.cameras.main.setScroll(0, this.cameras.main.scrollY);

        // Collider for ball, obstacles, and spikeys
        this.physics.add.collider(this.ball, this.platforms);
        this.physics.add.collider(this.ball, this.spikeys, () => {
            console.log("Game over!");
        });
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


        //

    }

    /* Obstacle spawns are column-based to prevent overlap.
        */
    spawn_obstacles() {
        let cols = [];
        for (let i = 0; i < COLS; i++) {
            cols[i] = i;
        }

        let rows = [];
        for (let i = 0; i < ROWS; i++) {
            rows[i] = i;
        }

        Phaser.Utils.Array.Shuffle(cols);
        Phaser.Utils.Array.Shuffle(rows);

        for (let i = 0; i < COLS; i++) {
            if (i <= COLS / 3) {

                new Platform(this, cols[i] * OBSTACLE_SIZE, rows.pop() * OBSTACLE_SIZE).setOrigin(0);
            } else {
                new Spikey_Ball(this, cols[i] * OBSTACLE_SIZE, rows.pop() * OBSTACLE_SIZE).setOrigin(0);
            }
        }

    }
}
