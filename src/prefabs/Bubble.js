class Bubble extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bubble'); 
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.bubbles.add(this);
        this.setImmovable(true);
        this.body.pushable = false;
        this.setCircle(this.width / 2);
    }
}
