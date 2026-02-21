class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    preload() {

    }

    create() {
        // Start music
        this.background_music = this.sound.add('ocean_music', {volume: 0.5, loop: true});
        this.background_music.play();
        // PIPELINE -----------------------------------------------
        // Add the water warping pipeline to the pipeline manager
        
        const pipelineManager = this.sys.renderer.pipelines;
        if (!pipelineManager.has('water_prefx')) {
        this.water_pipeline = pipelineManager.add('water_prefx', new Water_Pipeline(game, this));
        } else
            this.water_pipeline = pipelineManager.get('water_prefx');
        this.water = this.add.image(0, 0, 'water').setOrigin(0).setDisplaySize(width, height).setPipeline('water_prefx');
        this.water.setScrollFactor(0);
        this.water_pipeline.set1f('y_resolution', height);


        // SOUND ---------------------------------------------------

        // Add popping sounds to an array so we can randomly select one later
        this.pop_sounds = ['pop_sfx_1', 'pop_sfx_2'];
        
        // TEXT -----------------------------------------------------

        // Score
        this.score = 0;
        this.score_text = this.add.text(0, 0, "0m", {
            fontSize: '48px', 
            color: '#000000a',
            padding: { left: 10}}).setDepth(1000).setOrigin(0);
        // Stick the score text to the camera
        this.score_text.setScrollFactor(0);

        // PHYSICS --------------------------------------------------
        
        // When the next speed increase will occur
        this.next_speed_increase = max_velocity / 4;

        // Add physics groups for obstacles
        this.platforms = this.physics.add.group({ immovable: true });
        this.bubbles = this.physics.add.group({ immovable: true });
        this.fish = this.physics.add.group();


        // Add hook sprite
        this.hook = this.physics.add.sprite(width / 2, HOOK_START_Y, 'hook');
        this.hook.setCircle(this.hook.width / 2, 0, 25);
        this.hook.setGravityY(200);
        this.hook.body.setBounce(BOUNCE_FACTOR);
        this.hook.body.setMaxVelocityY(max_velocity);
        this.hook.body.setMaxVelocityX(HARD_MAX_VELOCITY); // avoid phasing!

        // Add side walls beyond camera so that the ball bounces of the sides
        this.left_boundry = this.add.rectangle(0, 0, 10, height + 100).setOrigin(1, 0.5);
        this.right_boundry = this.add.rectangle(width, 0, 10, height + 100).setOrigin(0, 0.5);
        this.platforms.add(this.left_boundry); 
        this.platforms.add(this.right_boundry); 
        
        // Array holding the active obstacle chunks
        this.chunks = new Array();
        // Spawn one chunk in current camera view (300px offset), and one below
        this.chunks.push(this.spawn_chunk(300));
        this.chunks.push(this.spawn_chunk(300 + height));


        // Stick camera to ball (only verically)
        this.cameras.main.startFollow(this.hook, true, 0, 1);
        this.cameras.main.setScroll(0, this.cameras.main.scrollY);

        // Collider checking against the hook, invisible side platforms, bubbles, and fish
        this.physics.add.collider(this.hook, this.platforms);
        this.physics.add.collider(this.hook, this.bubbles, (hook, bubble) => {
            // Add a temp sprite to play animation while getting rid of physics body
            const x = bubble.x; 
            const y = bubble.y;

            bubble.destroy();
            this.sound.play(Phaser.Math.RND.pick(this.pop_sounds));
            
            const temp_bubble = this.add.sprite(x, y, 'bubble').setOrigin(0);
            temp_bubble.play('pop');
            temp_bubble.once('animationcomplete', () => { temp_bubble.destroy(); });
        });
        this.physics.add.collider(this.hook, this.fish, (hook, fish) => {
            this.background_music.stop();
            this.sound.play('ow_sfx');
            fish.destroy();

            // Update high score if needed
            if (this.score > high_score) {
                high_score = this.score;
            }
            this.scene.start('Menu');
        });
        
        // Add keys to the input manager
        left = this.input.keyboard.addKey('A');
        right = this.input.keyboard.addKey('D');

    }

    update(time, delta) {
        // Update shader scroll
        this.water_pipeline.set1f('scrollY', this.cameras.main.scrollY);

        // Update text
        this.score = (this.hook.y - HOOK_START_Y) / 100;
        this.score_text.setText(`${Math.floor(this.score)}m`);


        // Check if speed needs to be increased
        if (max_velocity < HARD_MAX_VELOCITY && this.score > this.next_speed_increase) {
            max_velocity *= VELOCITY_MULTIPLIER;
            this.hook.body.setMaxVelocityY(max_velocity);
            this.next_speed_increase += max_velocity / 4; 
        }

        // Move the side boundries with the ball
        this.left_boundry.y = this.right_boundry.y = this.hook.y;

        // Burst movement: Set velocity high on tap, and quickly decay it
        if (Phaser.Input.Keyboard.JustDown(left)) {
            this.hook.setVelocityX(-MOVE_SPEED);
        } else if (Phaser.Input.Keyboard.JustDown(right)) {
            this.hook.setVelocityX(MOVE_SPEED);
        }

        /* Velocity is multiplied by DECAY ^ delta / C where C is any constant. This helps the decay rate stay
            * consistent across different framerates while ensuring that the whole expression is never
            * greater than 1. 
            */
        this.hook.body.velocity.x *= Math.pow(DECAY, delta / 12);

        if (Math.abs(this.hook.body.velocity.x) < 5) {
            this.hook.setVelocityX(0);
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

            if (i < COLS * 0.7) {
                // Make some bubbles
                chunk[i] = new Bubble(this, cur_col, cur_row).setOrigin(0);
            } else {
                // Make fish
                chunk[i] = new Fish(this, cur_col, cur_row).setOrigin(0);
            }
        }
        // Set the next spawn threshold to the bottom of the screen
        this.next_spawn_threshhold = offset;

        return chunk;
    }

    end_game() {


    }
}



