import { BaseScene } from "./base_scene";
import { scene_manager } from "../main";
import * as PIXI from "pixi.js";
import { Engine, Render, Body, Bodies, World } from "matter-js";
import * as TWEEN from "@tweenjs/tween.js";

export class GameScene3 extends BaseScene {
  private platform!: Body;
  private bunny!: PIXI.Sprite;
  private tweenBunny!: PIXI.Sprite;
  private tween!: TWEEN.Tween<PIXI.Sprite> | null;

  private bunnyTexture!: PIXI.Texture;
  private tweenBunnyTexture!: PIXI.Texture;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  async preload(): Promise<void> {
    try {
      [this.bunnyTexture, this.tweenBunnyTexture] = await Promise.all([
        PIXI.Assets.load("/assets/bunny.png"),
        PIXI.Assets.load("https://pixijs.com/assets/bunny.png"),
      ]);
    } catch (error) {
      console.error("Error preloading assets:", error);
    }
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;
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

    // Load assets asynchronously

    // Initialize sprites
    this.bunny = new PIXI.Sprite(this.bunnyTexture);
    this.bunny.anchor.set(0.5);
    this.bunny.pivot.set(0.5);
    this.bunny.x = 300;
    this.bunny.y = 100;
    this.app.stage.addChild(this.bunny);

    this.tweenBunny = new PIXI.Sprite(this.tweenBunnyTexture);
    this.tweenBunny.anchor.set(0.5);
    this.tweenBunny.pivot.set(0.5);
    this.tweenBunny.position.set(0, 300);
    this.app.stage.addChild(this.tweenBunny);

    // Set up tween animation
    this.tween = new TWEEN.Tween(this.tweenBunny)
      .to({ x: 300, y: 300 }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start();

    console.log("Tween is", this.tween);

    setTimeout(() => {
      scene_manager.goToScene("scene4");
    }, 3000);
    // this.loaded = true;
    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return; // Only update if the scene is active
    // console.log("Updating Game Scene 3  and deltaTime is", deltaTime);
    if (this.bunny && this.platform) {
      this.bunny.position.x = this.platform.position.x;
      this.bunny.position.y = this.platform.position.y;
    }
    TWEEN.update();
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);
    // Add any cleanup specific to Game Scene 2 here
  }
}
