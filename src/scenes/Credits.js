class Credits extends Phaser.Scene {
    constructor() {
        super('Credits');
    }

    create() {
        this.water = this.add.image(0, 0, 'water').setOrigin(0).setDisplaySize(width, height);

        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.bitmapText(width/2, height * 0.3, 'blue_winter_font', 
            'Code:\nMax Kinet\n\nArt:\nMax Kinet\n\n:Pop sfx:\nMax Kinet\n\nBackground music:\nMusic Word on Pixabay\n\nGame start sound:\n Floraphonic on Pixabay\n\nGame end sound:\nfreesound_community\non Pixabay',
            32).setCenterAlign().setOrigin(0.5);

        this.add.bitmapText(width / 2, height * 0.7, 'bubble_font', 'Press SPACE for menu', 42).setOrigin(0.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.scene.start('Menu');
        }
    }

}
