// game_scene3.ts
import { BaseScene } from "./base_scene";
import { scene_manager } from "../main";
import * as PIXI from "pixi.js";
import { Engine, Render, Body, Bodies, World } from "matter-js";
// import { SceneManager } from "./scene_manager";
import * as TWEEN from "@tweenjs/tween.js";

export class GameScene3 extends BaseScene {
  private platform!: Body;
  private bunny!: PIXI.Sprite;
  private tweenBunny!: PIXI.Sprite;
  private tween!: TWEEN.Tween<PIXI.Sprite> | null;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  init(): void {
    console.log("Initializing Game: ", this.name);
    // Add any specific initialization code for Game Scene 3 here
    this.platform = Bodies.rectangle(600, 400, 300, 300, {
      isStatic: true, // Make sure it is dynamic
      friction: 1, // High friction so objects don't slide off
      mass: 1,
      restitution: 0.1, // Low restitution to prevent bouncing
      density: 0.5, // Set density to a reasonable value to prevent heavy impacts
      inertia: Infinity,
      inverseInertia: Infinity,
      label: "ground",
    });
    World.add(this.engine.world, this.platform);

    (async () => {
      const bunnyTexture = await PIXI.Assets.load("/assets/bunny.png");
      this.bunny = new PIXI.Sprite(bunnyTexture);
      this.bunny.anchor.set(0.5);
      this.bunny.pivot.set(0.5);
      this.bunny.x = 300;
      this.bunny.y = 100;
      this.app.stage.addChild(this.bunny);

      const tweenBunnyTexture = await PIXI.Assets.load("/assets/bunny.png");
      this.tweenBunny = new PIXI.Sprite(tweenBunnyTexture);
      this.tweenBunny.anchor.set(0.5);
      this.tweenBunny.pivot.set(0.5);
      this.tweenBunny.x = 100;
      this.tweenBunny.y = 50;
      this.app.stage.addChild(this.tweenBunny);

      this.tween = new TWEEN.Tween(this.tweenBunny)
        .to({ position: { x: 300, y: 300 } }, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .start();
      console.log("Tween is", this.tween);
    })();
    setTimeout(() => {
      scene_manager.goToScene("scene2");
    }, 3000);
  }

  update(_deltaTime: number): void {
    if (!this.active) return; // Only update if the scene is active
    // console.log("Updating Game Scene 3  and deltaTime is", deltaTime);
    if (this.bunny && this.platform) {
      this.bunny.position.x = this.platform.position.x;
      this.bunny.position.y = this.platform.position.y;
    }
    TWEEN.update();
  }

  destroy(): void {
    console.log("Destroying Game: ", this.name);
    // Add any cleanup specific to Game Scene 2 here
  }
}
