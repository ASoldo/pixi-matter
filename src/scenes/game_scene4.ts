import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import vertex from "../system/shaders/demo/vert-shader.glsl";
import fragment from "../system/shaders/demo/frag-shader.glsl";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";

export class GameScene4 extends BaseScene {
  private quad!: PIXI.Mesh;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 4");
    await PIXI.Assets.load("https://pixijs.com/assets/bg_rotate.jpg");
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

    // Load the texture
    const texture = (
      await PIXI.Assets.load("https://pixijs.com/assets/bg_rotate.jpg")
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
        fragment,
      },

      resources: {
        uTexture: texture,
      },
    });

    // Create meshes
    this.quad = new PIXI.Mesh({
      geometry: geometry,
      shader,
    }) as PIXI.Mesh;

    // Set positions
    this.quad.position.set(400, 300);

    // Add meshes to the stage
    this.app.stage.addChild(this.quad);

    // Set the loaded flag
    this.setLoaded(true);

    setTimeout(() => {
      scene_manager.goToScene(SceneNames.SCENE5);
    }, 3000);
  }

  async update(deltaTime: number): Promise<void> {
    if (!this.active) return; // Only update if the scene is active

    // Update the rotation of the meshes
    this.quad.rotation += deltaTime * 0.01;
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);
    // Remove meshes from the stage and destroy them
    this.app.stage.removeChild(this.quad);
    this.quad.destroy();
  }
}
