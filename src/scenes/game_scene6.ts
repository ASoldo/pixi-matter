import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";

export class GameScene6 extends BaseScene {
  private manifest!: any;
  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 5");
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;
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

    PIXI.Assets.backgroundLoadBundle(["bunny", "bunny_remote"]);

    // Load the video texture
    // Set a timeout to switch to the next scene after the video ends
    setTimeout(() => {
      scene_manager.goToScene(SceneNames.SCENE1);
    }, 1000);

    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);
  }
}
