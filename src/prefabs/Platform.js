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
}
