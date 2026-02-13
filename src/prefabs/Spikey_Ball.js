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
} 
