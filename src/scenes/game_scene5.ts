import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";

export class GameScene5 extends BaseScene {
  public texture!: PIXI.Texture;
  public videoSprite!: PIXI.Sprite;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 5");
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

    // Load the video texture
    this.texture = await PIXI.Assets.load({
      src: "https://pixijs.com/assets/video.mp4",
      data: {
        muted: true,
      },
      type: "video",
    });

    // Create a PIXI sprite using the video texture
    this.videoSprite = new PIXI.Sprite(this.texture);
    this.videoSprite.position.set(0, 0);
    this.videoSprite.width = this.app.screen.width;
    this.videoSprite.height = this.app.screen.height;
    this.app.stage.addChild(this.videoSprite);

    // Example of how to pause the video
    // (this.texture.source.resource as HTMLVideoElement).pause();

    // Set a timeout to switch to the next scene after the video ends
    setTimeout(
      () => {
        scene_manager.goToScene(SceneNames.SCENE1);
      },
      (this.texture.source.resource as HTMLVideoElement).duration * 1000,
    ); // Convert seconds to milliseconds

    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
  }

  async destroy(): Promise<void> {
    await PIXI.Assets.unload(this.texture.source.label);
    this.videoSprite.destroy();
    console.log("Destroying Game: ", this.name);
  }
}
