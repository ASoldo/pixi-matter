import { BaseScene } from "./base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";
import { fetchGameRecords } from "../api/api";
import { assetManager } from "../core/asset_manager";
import { BundleRecord } from "../api/api";

export class SplashScene extends BaseScene {
  constructor(
    app: PIXI.Application,
    engine: Engine,
    render: Render,
    nextScene: string,
  ) {
    super(app, engine, render, nextScene);
  }

  async preload(): Promise<void> {
    console.log("Preloading Splash Scene");
    try {
      const records = await fetchGameRecords();
      console.log("Fetched records: ", records);

      if (!records) {
        throw new Error("No records fetched");
      }

      await assetManager.loadManifest(records as BundleRecord[]);
      console.log("Assets preloaded");
    } catch (error) {
      console.log("Error preloading assets: ", error);
    }
  }

  async init(): Promise<void> {
    console.log("Initializing Splash Scene: ", this.name);
    this.loaded = false;
    console.log("NextScene: ", this.nextScene);
    scene_manager.goToScene(this.nextScene as SceneNames); // or GameScene3, as appropriate
    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
  }

  async destroy(): Promise<void> {
    console.log("Destroying Splash Scene: ", this.name);
  }
}
