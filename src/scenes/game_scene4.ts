import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import vertex from "../system/shaders/demo/vert-shader.glsl";
import noise_fragment from "../system/shaders/noise_shader/noise_frag.glsl";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";

export class GameScene4 extends BaseScene {
  private quad!: PIXI.Mesh;
  private noise_texture!: PIXI.Texture;
  private elapsedTime: number;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
    this.elapsedTime = 0;
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 4");
    await PIXI.Assets.load("https://pixijs.com/assets/perlin.jpg");
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

    // Load the texture
    this.noise_texture = (
      await PIXI.Assets.load("https://pixijs.com/assets/perlin.jpg")
    ).source;

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
        fragment: noise_fragment,
      },

      resources: {
        uTexture: this.noise_texture,
        noiseUniforms: {
          limit: { type: "f32", value: 0.5 },
        },
        noise: this.noise_texture,
      },
    });

    // Create meshes
    this.quad = new PIXI.Mesh({
      geometry: geometry,
      shader,
    }) as PIXI.Mesh;

    // Set positions
    this.quad.position.set(400, 300);
    this.quad.width = this.app.screen.width;
    this.quad.height = this.app.screen.height;

    // Add meshes to the stage
    this.app.stage.addChild(this.quad);
    // Set the loaded flag
    this.setLoaded(true);
    // this.startTime = performance.now();
    setTimeout(() => {
      scene_manager.goToScene(SceneNames.SCENE5);
    }, 3000);
  }

  async update(deltaTime: number): Promise<void> {
    if (!this.active) return; // Only update if the scene is active

    this.elapsedTime += deltaTime;
    // Update the rotation of the meshes
    // this.quad.rotation += deltaTime * 0.01;
    // const elapsedTime = (performance.now() - this.startTime) / 1000;
    this.quad.shader.resources.noiseUniforms.uniforms.limit = Math.abs(
      Math.sin(this.elapsedTime * 0.005),
    );
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);
    this.elapsedTime = 0;
    // Remove meshes from the stage and destroy them
    this.app.stage.removeChild(this.quad);
    this.quad.destroy();
  }
}
