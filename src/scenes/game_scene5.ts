import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";

export class GameScene5 extends BaseScene {
  // public texture!: PIXI.Texture;
  // public videoSprite!: PIXI.Sprite;

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
    // this.texture = await PIXI.Assets.load({
    //   src: "https://videos.pexels.com/video-files/14597401/14597401-hd_1920_1080_24fps.mp4",
    //   data: {
    //     muted: true,
    //   },
    //   type: "video",
    // });
    //
    // // Create a PIXI sprite using the video texture
    // this.videoSprite = new PIXI.Sprite(this.texture);
    // this.videoSprite.position.set(0, 0);
    // this.videoSprite.width = this.app.screen.width;
    // this.videoSprite.height = this.app.screen.height;
    // this.app.stage.addChild(this.videoSprite);

    // Example of how to pause the video
    // (this.texture.source.resource as HTMLVideoElement).pause();

    // Add font files to the bundle
    PIXI.Assets.addBundle("fonts", [
      {
        alias: "ChaChicle",
        src: "https://pixijs.com/assets/webfont-loader/ChaChicle.ttf",
      },
      {
        alias: "Lineal",
        src: "https://pixijs.com/assets/webfont-loader/Lineal.otf",
      },
      {
        alias: "Dotrice Regular",
        src: "https://pixijs.com/assets/webfont-loader/Dotrice-Regular.woff",
      },
      {
        alias: "Crosterian",
        src: "https://pixijs.com/assets/webfont-loader/Crosterian.woff2",
      },
    ]);

    // Load the font bundle
    await PIXI.Assets.loadBundle("fonts");

    const text1 = new PIXI.Text({
      text: "ChaChicle.ttf",
      style: { fontFamily: "ChaChicle", fontSize: 50 },
    });
    const text2 = new PIXI.Text({
      text: "Lineal.otf",
      style: { fontFamily: "Lineal", fontSize: 50 },
    });
    const text3 = new PIXI.Text({
      text: "Dotrice Regular.woff",
      style: { fontFamily: "Dotrice Regular", fontSize: 50 },
    });
    const text4 = new PIXI.Text({
      text: "Crosterian.woff2",
      style: { fontFamily: "Crosterian", fontSize: 50 },
    });

    text2.y = 150;
    text3.y = 300;
    text4.y = 452;

    this.app.stage.addChild(text1);
    this.app.stage.addChild(text2);
    this.app.stage.addChild(text3);
    this.app.stage.addChild(text4);

    setTimeout(
      () => {
        scene_manager.goToScene(SceneNames.SCENE1);
      },
      /* (this.texture.source.resource as HTMLVideoElement).duration * 1000, */
      3000,
    );

    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;
  }

  async destroy(): Promise<void> {
    // await PIXI.Assets.unload(this.texture.source.label);
    // this.videoSprite.destroy();
    console.log("Destroying Game: ", this.name);
    await PIXI.Assets.unloadBundle("ChaChicle");
    await PIXI.Assets.unloadBundle("Lineal");
    await PIXI.Assets.unloadBundle("Dotrice Regular");
    await PIXI.Assets.unloadBundle("Crosterian");
  }
}
