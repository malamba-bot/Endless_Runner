class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        // AUDIO
        this.load.audio('pop_sfx_1', './assets/sfx/pop_sfx_1.mp3')
        this.load.audio('pop_sfx_2', './assets/sfx/pop_sfx_2.mp3')
        this.load.audio('water_woosh_sfx', './assets/sfx/water_woosh_sfx.mp3')
        this.load.audio('ocean_music', './assets/sfx/ocean_music.mp3')
        this.load.audio('ow_sfx', './assets/sfx/ow_sfx.mp3')

        // IMAGES
        this.load.image('hook', './assets/hook1.png');
        this.load.image('water', './assets/water.png');
        this.load.image('fish', './assets/fish.png');
        this.load.image('bubble', './assets/bubble.png');

        // SPRITE SHEETS
        this.load.spritesheet("bubble_pop", "./assets/bubble_pop_scaled.png", {
            frameWidth: 48,
            frameHeight: 48,
            startFrame: 0,
            endFrame: 3,
        })

        this.load.spritesheet("fish_blink", "./assets/fish.png", {
            frameWidth: 48,
            frameHeight: 48,
            startFrame: 0,
            endFrame: 3,
        })

        // BITMAP FONTS -----------------------------------------
        this.load.bitmapFont('bubble_font', './assets/fonts/bubble_font.png', './assets/fonts/bubble_font.xml')
        this.load.bitmapFont('blue_winter_font', './assets/fonts/blue_winter.png', './assets/fonts/blue_winter.xml')
    }

    create() {

        // ANIMATIONS -------------------------------------------
        this.anims.create({
            key: "pop",
            frames: this.anims.generateFrameNumbers("bubble_pop", { start: 1, end: 3, first: 1 }),
            frameRate: 12,
        })

        this.anims.create({
            key: "blink",
            frames: this.anims.generateFrameNumbers("fish_blink", { start: 0, end: 3, first: 0 }),
            frameRate: 8,
        })

        // INPUT --------------------------------------------------
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        c_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);


        // BACKGROUND
        
        const pipelineManager = this.sys.renderer.pipelines;
        if (!pipelineManager.has('water_prefx_menu')) {
        this.water_pipeline = pipelineManager.add('water_prefx_menu', new Water_Pipeline(game, this));
        } else
            this.water_pipeline = pipelineManager.get('water_prefx_menu');
        this.water = this.add.image(0, 0, 'water').setOrigin(0).setDisplaySize(width, height).setPipeline('water_prefx_menu');
        this.water_pipeline.set1f('y_resolution', height);
        this.water_pipeline.set1f('scrollY', 0);

        // TEXT ---------------------------------------------------
        this.add.bitmapText(width / 2, height * 0.05, 'blue_winter_font', `Deepest catch: ${Math.ceil(high_score)}m`, 24).setOrigin(0.5);

        this.add.bitmapText(width / 2, height * 0.2, 'bubble_font', 'Infinite\nFishing', 72).setOrigin(0.5);

        this.add.bitmapText(width / 2, height * 0.4, 'blue_winter_font', 'Use A and D to move\nyour hook left and right\nand get the deepest catch!', 32).setOrigin(0.5).setCenterAlign();

        this.add.bitmapText(width / 2, height * 0.55, 'bubble_font', 'Press SPACE to start', 42).setOrigin(0.5);


        this.add.bitmapText(width / 2, height * 0.65, 'bubble_font', 'Press C for credits', 26).setOrigin(0.5);



    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.sound.play('water_woosh_sfx');
            this.time.delayedCall(500, () => {
                this.scene.start('Play');
            });
        }

        if (Phaser.Input.Keyboard.JustDown(c_key)) {
                this.scene.start('Credits');
        }

    }

}
