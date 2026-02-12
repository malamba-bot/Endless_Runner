class Spikey_Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'spikey_ball'); 
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.spikeys.add(this);
    }
    
    preUpdate(time, delta) {
        const cam = this.scene.cameras.main;
        super.preUpdate(time, delta);
        // If spikey scrolled off the top of the screen
        if (this.y < cam.scrollY - 100) {
            // Wrap to bottom of screen
            this.y = cam.scrollY + height + 100;
        }
}
}
