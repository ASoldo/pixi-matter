import { BaseScene } from "../core/base_scene";
import { scene_manager } from "../core/core";
import * as PIXI from "pixi.js";
import { Engine, Render, Body, Bodies, World } from "matter-js";
import * as TWEEN from "@tweenjs/tween.js";
import { SceneNames } from "../system/types/scene_names";
import { assetManager } from "../core/asset_manager";

export class GameScene3 extends BaseScene {
  private platform!: Body;
  private bunny!: PIXI.Sprite;
  private tweenBunny!: PIXI.Sprite;
  private tween!: TWEEN.Tween<PIXI.Sprite> | null;

  constructor(
    app: PIXI.Application,
    engine: Engine,
    render: Render,
    nextScene: string,
  ) {
    super(app, engine, render, nextScene);
  }

  // Preload method to load textures
  async preload(): Promise<void> {
    try {
    } catch (error) {
      console.error("Error preloading assets:", error);
    }
  }

  // Initialize method to create sprites and add them to the stage
  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

    const GameScene3Textures = await PIXI.Assets.loadBundle(SceneNames.SCENE3);

    // Create a platform using Matter.js
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
    this.bunny = new PIXI.Sprite(GameScene3Textures.bunny);
    this.bunny.anchor.set(0.5);
    this.bunny.pivot.set(0.5);
    this.bunny.x = 300;
    this.bunny.y = 100;
    this.app.stage.addChild(this.bunny);

    this.tweenBunny = new PIXI.Sprite(GameScene3Textures.bunny2);
    this.tweenBunny.anchor.set(0.5);
    this.tweenBunny.pivot.set(0.5);
    this.tweenBunny.position.set(0, 300);
    this.app.stage.addChild(this.tweenBunny);

    // Set up tween animation for the tweenBunny sprite
    this.tween = new TWEEN.Tween(this.tweenBunny)
      .to({ x: 300, y: 300 }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start();

    console.log("Tween is", this.tween);
    scene_manager.debug();

    setTimeout(() => {
      scene_manager.goToScene(this.nextScene as SceneNames);
    }, 3000);
    this.setLoaded(true);
  }

  // Update method called on every frame
  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
    if (this.bunny && this.platform) {
      this.bunny.position.x = this.platform.position.x;
      this.bunny.position.y = this.platform.position.y;
    }
    TWEEN.update();
  }

  // Destroy method to clean up resources
  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);

    World.remove(this.engine.world, this.platform);

    this.app.stage.removeChild(this.bunny);
    this.bunny.destroy();

    this.app.stage.removeChild(this.tweenBunny);
    this.tweenBunny.destroy();

    this.tween?.stop();
    this.tween = null;

    await assetManager.unloadBundle(SceneNames.SCENE3);
  }
}
