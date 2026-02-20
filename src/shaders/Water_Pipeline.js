class Water_Pipeline extends Phaser.Renderer.WebGL.Pipelines.PreFXPipeline {
    constructor(game, scene) {
        super({
            game,
            fragShader:` 
            precision mediump float;
            uniform float time;
            uniform sampler2D uMainSampler; // Phaser provides (texture)
            uniform float scrollY;
            uniform float y_resolution;
            varying vec2 outTexCoord; // Phaser provides (normalized pixel pos)

            void main() {
                // Get the normalized x and y values of current pixel
                vec2 uv = outTexCoord;

                // Create waves - use sin and cos and incorperate time when determining which pixel in the
                // texture to sample
                uv.x += sin(uv.y * 10.0 + time * 3.0) * 0.01; // larger horizontal distortion
                uv.y += cos(uv.x * 10.0 + time * 2.0) * 0.005;

                // Scroll the camera - add the scroll of the camera and normalize when determining the y
                // position of the sampled pixel
                uv.y = fract(uv.y + scrollY / y_resolution);

                gl_FragColor = texture2D(uMainSampler, uv);
            }
            `
        });

        this.scene = scene;
    }

    onPreRender() {
        super.onPreRender();
        // Get new time and scrollY from the scene
        this.set1f('time', this.scene.time.now / 1000);
        this.set1f('scrollY', this.scene.cameras.main.scrollY);
    }
}
