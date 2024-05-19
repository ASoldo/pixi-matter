import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";

export class GameScene6 extends BaseScene {
  private manifest!: PIXI.AssetsManifest;
  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 5");

    this.manifest = {
      bundles: [
        {
          name: "bunny",
          assets: [
            {
              alias: "bunny",
              src: "/assets/images/bunny.png",
            },
          ],
        },
        {
          name: "bunny_remote",
          assets: [
            {
              alias: "bunny_remote",
              src: "https://pixijs.com/assets/bunny.png",
            },
          ],
        },
      ],
    };

    await PIXI.Assets.init({ manifest: this.manifest });

    await PIXI.Assets.backgroundLoadBundle(["bunny", "bunny_remote"]);
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
