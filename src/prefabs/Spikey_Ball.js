class Spikey_Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'spikey_ball'); 
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.spikeys.add(this);
        this.setCircle(this.width / 2);
        this.setImmovable(true);
        this.body.pushable = false;
    }
    
    preUpdate(time, delta) {
        const cam = this.scene.cameras.main;
        super.preUpdate(time, delta);
        // If scrolled off the top of the screen
        if (this.y < cam.scrollY - 100) {
            // Put into new col
            let col = Phaser.Math.Between(0, COLS - 1);
            this.x = col * OBSTACLE_SIZE;
            // Wrap to bottom of screen
            this.y = cam.scrollY + height;
        }
}
}
