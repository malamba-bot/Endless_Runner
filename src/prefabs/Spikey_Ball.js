class Fish extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'fish_blink', 0); 
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.spikeys.add(this);
        this.body.setSize(OBSTACLE_SIZE, OBSTACLE_SIZE * 0.6);
        this.setImmovable(true);
        this.body.pushable = false;

        // Play blink animation at random interval
        this.create_timer();
    }

    create_timer() {
        let time_till_blink = Phaser.Math.Between(1000, 4000);
        this.scene.time.delayedCall(time_till_blink, () => {
            this.blink();
        });

    }

    blink() {
        this.play('blink');
        this.once('animationcomplete', () => {
            this.setFrame(0);
            this.create_timer();
        });
    }
} 
