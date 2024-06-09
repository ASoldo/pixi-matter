import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import vertex from "../system/shaders/demo/vert_shader.glsl";
import frag_noise from "../system/shaders/noise_shader/frag_noise.glsl";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";
import * as TWEEN from "@tweenjs/tween.js";

export class GameScene4 extends BaseScene {
  private quad!: PIXI.Mesh;
  private noise_texture!: PIXI.Texture;
  private tween!: TWEEN.Tween<Object> | null;
  private bunny!: PIXI.Sprite;
  private bunnyTexture!: PIXI.Texture;

  constructor(
    app: PIXI.Application,
    engine: Engine,
    render: Render,
    nextScene: string,
  ) {
    super(app, engine, render, nextScene);
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 4");

    // Load the texture
    this.noise_texture = (
      await PIXI.Assets.load("https://pixijs.com/assets/perlin.jpg")
    ).source;

    this.bunnyTexture = await PIXI.Assets.load(
      "https://pixijs.com/assets/bunny.png",
    );
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

    const geometry: PIXI.Geometry = new PIXI.Geometry({
      attributes: {
        aPosition: [
          -100,
          -100, // x, y
          100,
          -100, // x, y
          100,
          100, // x, y,
          -100,
          100, // x, y,
        ],
        aUV: [0, 0, 1, 0, 1, 1, 0, 1],
      },
      indexBuffer: [0, 1, 2, 0, 2, 3],
    });

    // Create shader
    const shader: PIXI.Shader = PIXI.Shader.from({
      gl: {
        vertex,
        fragment: frag_noise,
      },

      resources: {
        noise_uniforms: {
          limit: { type: "f32", value: 0.0 },
          color: { type: "vec3<f32>", value: [0.0, 0.0, 0.0] },
        },
        noise: this.noise_texture.source,
      },
    });

    // Create meshes
    this.quad = new PIXI.Mesh({
      geometry: geometry,
      shader,
    }) as PIXI.Mesh;

    // Set positions
    this.quad.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2,
    );
    this.quad.width = this.app.screen.width;
    this.quad.height = this.app.screen.height;

    // Add meshes to the stage
    this.app.stage.addChild(this.quad);
    this.quad.zIndex = 1;

    this.bunny = new PIXI.Sprite(this.bunnyTexture);
    this.bunny.anchor.set(0.5);
    this.bunny.x = this.app.screen.width / 2;
    this.bunny.y = this.app.screen.height / 2;
    this.app.stage.addChild(this.bunny);

    // Set the loaded flag
    this.setLoaded(true);

    this.tween = new TWEEN.Tween(
      this.quad.shader.resources.noise_uniforms.uniforms,
    )
      .to({ limit: 1, color: [1.0, 0.0, 0.0] }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start();

    setTimeout(() => {
      scene_manager.goToScene(this.nextScene as SceneNames);
    }, 3000);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return; // Only update if the scene is active

    TWEEN.update();
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);

    // Reset scene variables

    // Remove meshes from the stage and destroy them
    this.app.stage.removeChild(this.quad);
    this.quad.destroy();

    await PIXI.Assets.unload(this.noise_texture.source.label);

    await PIXI.Assets.unload(this.bunnyTexture.source.label);
    this.bunny.destroy();

    this.tween?.stop();
    this.tween = null;
  }
}
