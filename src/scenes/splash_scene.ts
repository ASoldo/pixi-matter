import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";
import { fetchGameRecords } from "../api/api";

export class SplashScene extends BaseScene {
  public manifest!: PIXI.AssetsManifest;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 6");
    try {
      const records = await fetchGameRecords();
      console.log("Fetched records: ", records);

      // Convert the fetched records into a format compatible with the PixiJS manifest
      this.manifest = {
        bundles: records!.map((bundle: any) => ({
          name: bundle.name,
          assets: bundle.assets.map((asset: any) => ({
            alias: asset.alias,
            src: asset.imgUrl || asset.src, // Use imgUrl if available, otherwise src
          })),
        })),
      };

      console.log("Generated manifest: ", this.manifest);

      await PIXI.Assets.init({ manifest: this.manifest });
      await PIXI.Assets.backgroundLoadBundle(
        this.manifest.bundles.map((bundle) => bundle.name),
      );
    } catch (error) {
      console.log("Error preloading assets: ", error);
    }
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;
    scene_manager.goToScene(SceneNames.SCENE1);
    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);
  }
}
