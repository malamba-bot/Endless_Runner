class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'platform'); 
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.platforms.add(this);
        this.setImmovable(true);
        this.body.pushable = false;
        this.body.width = 18;
        this.body.setOffset(6, 0);
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
            this.y = cam.scrollY + height + Phaser.Math.Between(0, 5) * OBSTACLE_SIZE;

        }
    }
}
