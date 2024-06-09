import { BaseScene } from "../core/base_scene";
import { scene_manager } from "../core/core";
import * as PIXI from "pixi.js";
import { Engine, Render, Body, Bodies, World } from "matter-js";
import * as TWEEN from "@tweenjs/tween.js";
import { SceneNames } from "../system/types/scene_names";
import { assetManager } from "../core/asset_manager";
import { AssetRecord, BundleRecord } from "../api/api";

export class GameScene3 extends BaseScene {
  private platform!: Body;
  private bunny!: PIXI.Sprite;
  private tweenBunny!: PIXI.Sprite;
  private tween!: TWEEN.Tween<PIXI.Sprite> | null;

  // Private field to store textures
  private textures: Record<string, PIXI.Texture> = {};

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
      const manifest = assetManager.getManifest();
      if (!manifest) {
        throw new Error("Manifest not loaded");
      }

      // Create an array of promises to load each texture
      const loadPromises: Array<Promise<PIXI.Texture>> = [];
      for (const bundle of manifest.bundles as BundleRecord[]) {
        for (const asset of bundle.assets as AssetRecord[]) {
          loadPromises.push(PIXI.Assets.load(asset.alias));
        }
      }

      // Await all load promises
      await Promise.all(loadPromises);

      // Store loaded textures in the private field
      for (const bundle of manifest.bundles as BundleRecord[]) {
        for (const asset of bundle.assets as AssetRecord[]) {
          this.textures[asset.alias] = PIXI.Assets.get(
            asset.alias,
          ) as PIXI.Texture;
        }
      }
    } catch (error) {
      console.error("Error preloading assets:", error);
    }
  }

  // Initialize method to create sprites and add them to the stage
  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

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
    this.bunny = new PIXI.Sprite(this.textures["bunny"]);
    this.bunny.anchor.set(0.5);
    this.bunny.pivot.set(0.5);
    this.bunny.x = 300;
    this.bunny.y = 100;
    this.app.stage.addChild(this.bunny);

    this.tweenBunny = new PIXI.Sprite(this.textures["bunny2"]);
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

    const bundleNames = assetManager.getBundleNames();
    await Promise.all(
      bundleNames.map((bundleName: string) =>
        assetManager.unloadBundle(bundleName),
      ),
    );

    this.app.stage.removeChild(this.bunny);
    this.bunny.destroy();

    this.app.stage.removeChild(this.tweenBunny);
    this.tweenBunny.destroy();

    this.tween?.stop();
    this.tween = null;
  }
}
