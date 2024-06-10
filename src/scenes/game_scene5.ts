import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";

export class GameScene5 extends BaseScene {
  constructor(
    app: PIXI.Application,
    engine: Engine,
    render: Render,
    nextScene: string,
  ) {
    super(app, engine, render, nextScene);
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 5");
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

    const GameScene5Fonts = await PIXI.Assets.loadBundle(SceneNames.SCENE5);
    console.log("GameScene5Fonts: ", GameScene5Fonts);

    const text1 = new PIXI.Text({
      text: "ChaChicle.ttf",
      style: {
        fontFamily: JSON.stringify(GameScene5Fonts.ChaChicle.family),
        fontSize: 50,
      },
    });
    const text2 = new PIXI.Text({
      text: "Lineal.otf",
      style: {
        fontFamily: JSON.stringify(GameScene5Fonts.Lineal.family),
        fontSize: 50,
      },
    });

    console.log("Lineal: ", JSON.stringify(GameScene5Fonts.Lineal.family));
    const text3 = new PIXI.Text({
      text: "Dotrice Regular.woff",
      style: {
        fontFamily: JSON.stringify(GameScene5Fonts.DotriceRegular.family),
        fontSize: 50,
      },
    });
    const text4 = new PIXI.Text({
      text: "Crosterian.woff2",
      style: {
        fontFamily: JSON.stringify(GameScene5Fonts.Crosterian.family),
        fontSize: 50,
      },
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
        scene_manager.goToScene(this.nextScene as SceneNames);
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
    // this.videoSprite.destroy();
    console.log("Destroying Game: ", this.name);
  }
}
