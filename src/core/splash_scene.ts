import { BaseScene } from "./base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { assetManager } from "../core/asset_manager";
import { SceneNames } from "../system/types/scene_names";
import { fetchGameRecords } from "../api/bundle_config_api";
import { BundleRecord } from "../api/bundle_config_api";

export class SplashScene extends BaseScene {
  constructor(
    app: PIXI.Application,
    engine: Engine,
    render: Render,
    nextScene: string,
    sceneNames: string[],
  ) {
    super(app, engine, render, nextScene, sceneNames);
  }

  async preload(): Promise<void> {
    console.log("Preloading Splash Scene");
    try {
      const records = await fetchGameRecords(this.sceneNames as string[]);
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
    scene_manager.goToScene(this.nextScene as SceneNames);
    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
  }

  async destroy(): Promise<void> {
    console.log("Destroying Splash Scene: ", this.name);
  }
}
