class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        // AUDIO
        this.load.audio('pop_sfx_1', './assets/sfx/pop_sfx_1.mp3')
        this.load.audio('pop_sfx_2', './assets/sfx/pop_sfx_2.mp3')
        
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
    }

    create() {

        // ANIMATIONS ------------------------------------------

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

    }

}
