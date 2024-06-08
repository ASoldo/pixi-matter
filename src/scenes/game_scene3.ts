import { BaseScene } from "../core/base_scene";
import { scene_manager } from "../core/core";
import * as PIXI from "pixi.js";
import { Engine, Render, Body, Bodies, World } from "matter-js";
import * as TWEEN from "@tweenjs/tween.js";
import { SceneNames } from "../system/types/scene_names";

export class GameScene3 extends BaseScene {
  private platform!: Body;
  private bunny!: PIXI.Sprite;
  private tweenBunny!: PIXI.Sprite;
  private tween!: TWEEN.Tween<PIXI.Sprite> | null;

  private bunnyTexture!: PIXI.Texture;
  private tweenBunnyTexture!: PIXI.Texture;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  async preload(): Promise<void> {
    try {
      const [bunnyTexture, tweenBunnyTexture] = await Promise.all([
        PIXI.Assets.load("bunny"),
        PIXI.Assets.load("bunny2"),
      ]);

      this.bunnyTexture = bunnyTexture as PIXI.Texture;
      this.tweenBunnyTexture = tweenBunnyTexture as PIXI.Texture;
    } catch (error) {
      console.error("Error preloading assets:", error);
    }
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

    this.platform = Bodies.rectangle(600, 400, 300, 300, {
      isStatic: true,
      friction: 1,
      mass: 1,
      restitution: 0.1,
      density: 0.5,
      inertia: Infinity,
      inverseInertia: Infinity,
      label: "ground",
    });
    World.add(this.engine.world, this.platform);

    // Initialize sprites with loaded textures
    this.bunny = new PIXI.Sprite(this.bunnyTexture);
    this.bunny.anchor.set(0.5);
    this.bunny.pivot.set(0.5);
    this.bunny.x = 300;
    this.bunny.y = 100;
    this.app.stage.addChild(this.bunny);

    this.tweenBunny = new PIXI.Sprite(this.tweenBunnyTexture);
    this.tweenBunny.anchor.set(0.5);
    this.tweenBunny.pivot.set(0.5);
    this.tweenBunny.position.set(0, 300);
    this.app.stage.addChild(this.tweenBunny);

    // Set up tween animation
    this.tween = new TWEEN.Tween(this.tweenBunny)
      .to({ x: 300, y: 300 }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start();

    console.log("Tween is", this.tween);
    scene_manager.debug();

    setTimeout(() => {
      scene_manager.goToScene(SceneNames.SCENE4);
    }, 3000);
    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
    if (this.bunny && this.platform) {
      this.bunny.position.x = this.platform.position.x;
      this.bunny.position.y = this.platform.position.y;
    }
    TWEEN.update();
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);

    World.remove(this.engine.world, this.platform);

    await PIXI.Assets.unloadBundle("bunny");
    this.app.stage.removeChild(this.bunny);
    this.bunny.destroy();

    await PIXI.Assets.unloadBundle("bunny2");
    this.app.stage.removeChild(this.tweenBunny);
    this.tweenBunny.destroy();

    this.tween?.stop();
    this.tween = null;
  }
}
