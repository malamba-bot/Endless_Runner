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

        // Score
        this.score = 0;
        this.score_text = this.add.text(0, 0, "0", {
            fontSize: '48px', 
            color: '#000000a',
            padding: { left: 10}}).setDepth(1000).setOrigin(0);
        // Stick the score text to the camera
        this.score_text.setScrollFactor(0);

        // Physics group for obstacles
        this.platforms = this.physics.add.group({ immovable: true });
        this.spikeys = this.physics.add.group();

        // Add background tilesprite
        this.sky = this.add.tileSprite(0, 0, 480, 960, 'sky').setOrigin(0);
        this.sky.setScrollFactor(0);

        // Add ball sprite
        this.ball = this.physics.add.sprite(width / 2, BALL_START, 'old_ball');
        this.ball.setCircle(this.ball.width / 2);
        this.ball.setGravityY(200);
        this.ball.body.setBounce(BOUNCE_FACTOR);
        this.ball.body.setMaxVelocityY(max_velocity);

        // Add side walls beyond camera so that the ball bounces of the sides
        this.left_boundry = this.add.rectangle(0, 0, 10, height).setOrigin(1, 0.5);
        this.right_boundry = this.add.rectangle(width, 0, 10, height).setOrigin(0, 0.5);
        this.platforms.add(this.left_boundry); 
        this.platforms.add(this.right_boundry); 
        
        // Array holding the active obstacle chunks
        this.chunks = new Array();
        // Spawn one chunk in current camera view (300px offset), and one below
        this.chunks.push(this.spawn_chunk(300));
        this.chunks.push(this.spawn_chunk(300 + height));


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
        // Update text
        this.score = (this.ball.y-BALL_START) / 100;
        this.score_text.setText(Math.floor(this.score));

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

        // CHUNKS ----------------------------------------------
        // When the spawn threshold has been reached
        if (this.cameras.main.scrollY > this.next_spawn_threshhold) {
            // Spawn a new chunk past the bottom of the screen and add it to
            // the chunks array
            this.chunks.push(this.spawn_chunk(this.cameras.main.scrollY + height));
            // Delete the chunk which has scrolled past and remove it from
            // the chunks array
            let old_chunk = this.chunks.shift();
            old_chunk.forEach((obs) => { obs.destroy(); }); 
        }

    }

    /* Obstacles are spawned in chunks using rows and columns to prevent
        * overlap.
        * 
        * A random permutation of 0 -> COLS - 1 and ROWS - 1 are generated
        * by shuffling arrays. 
        *
        * A col and row number are taken from the ends of the arrays
        * to create each obstacle, placing it at a random and unique
        * location.
        *
        * offset is added to all rows, in case it needs to be spawned below
        * another chunk.
        *
        * next_spawn_threshold - the y coordinate which will
        * trigger the spawn of a new chunk upon crossing the top of the
        * screen is set to the offset (meaning a new chunk will spawn once
        * the beginning of this chunk is at the top of the screen.
        * 
        * All obstacles in this chunk are returned in an array, so they can
        * grouped together in the chunks array and deleted together later 
        */

    spawn_chunk(offset) {
        let chunk = new Array();
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
            let cur_col =  cols[i] * OBSTACLE_SIZE;
            let cur_row = offset + rows.pop() * OBSTACLE_SIZE;

            if (i <= COLS / 3) {
                // Make some platforms
                chunk[i] = new Platform(this, cur_col, cur_row).setOrigin(0);
            } else {
                // Make spikey balls
                chunk[i] = new Spikey_Ball(this, cur_col, cur_row).setOrigin(0);
            }
        }
        // Set the next spawn threshold to the bottom of the screen
        this.next_spawn_threshhold = offset;

        return chunk;
    }
}


