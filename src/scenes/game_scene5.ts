import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";

export class GameScene5 extends BaseScene {
  public texture!: PIXI.Texture;
  public videoSprite!: PIXI.Sprite;
  private videoElement!: HTMLVideoElement;

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

    // Create the video element
    this.videoElement = document.createElement("video");
    this.videoElement.src = this.texture.source.label;
    this.videoElement.crossOrigin = "anonymous";

    // Create a PIXI sprite using the video texture
    this.videoSprite = new PIXI.Sprite(this.texture);
    this.videoSprite.position.set(0, 0);
    this.videoSprite.width = this.app.screen.width;
    this.videoSprite.height = this.app.screen.height;
    this.app.stage.addChild(this.videoSprite);

    // Event listener for video metadata
    this.videoElement.addEventListener("loadedmetadata", () => {
      const videoDuration = this.videoElement.duration;
      console.log(`Video duration: ${videoDuration} seconds`);

      // Set a timeout to switch to the next scene after the video ends
      setTimeout(() => {
        scene_manager.goToScene(SceneNames.SCENE1);
      }, videoDuration * 1000); // Convert seconds to milliseconds
    });

    // Error handling for video load
    this.videoElement.addEventListener("error", (error) => {
      console.error("Error loading video: ", error);
      scene_manager.goToScene(SceneNames.SCENE1); // Fallback to the next scene
    });

    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
  }

  async destroy(): Promise<void> {
    PIXI.Assets.unload(this.texture.source.label);
    this.videoSprite.destroy();
    this.videoElement.remove();
    console.log("Destroying Game: ", this.name);
  }
}
