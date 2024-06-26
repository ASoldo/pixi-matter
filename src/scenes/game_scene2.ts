import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import Matter, { Engine, Render, World, Bodies } from "matter-js";
import { scene_manager } from "../core/core";
import { SceneNames } from "../system/types/scene_names";
import * as TWEEN from "@tweenjs/tween.js";
import { getCubicBezierPoint } from "../system/utils/curves/getCubicBezierPoint";

export class GameScene2 extends BaseScene {
  protected platform!: Matter.Body;
  protected p0: PIXI.Point = new PIXI.Point(0, 0);
  protected p1: PIXI.Point = new PIXI.Point(100, 400);
  protected p2: PIXI.Point = new PIXI.Point(400, 100);
  protected p3: PIXI.Point = new PIXI.Point(600, 400);
  private tween!: TWEEN.Tween<Object> | null;
  private animatedCircle!: PIXI.Graphics;
  constructor(
    app: PIXI.Application,
    engine: Engine,
    render: Render,
    nextScene: string,
  ) {
    super(app, engine, render, nextScene);
  }

  async preload(): Promise<void> {
    console.log("Preloading Game Scene 2");
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;
    // Add any specific initialization code for Game Scene 2 here
    this.platform = Bodies.rectangle(0, 600, 300, 300, {
      isStatic: true, // Make sure it is static
      friction: 1, // High friction so objects don't slide off
      mass: 1,
      restitution: 0.1, // Low restitution to prevent bouncing
      density: 0.5, // Set density to a reasonable value to prevent heavy impacts
      inertia: Infinity,
      inverseInertia: Infinity,
      label: "ground",
    });
    World.add(this.engine.world, this.platform);

    const path = new PIXI.Graphics();
    path.moveTo(this.p0.x, this.p0.y);
    path.lineTo(this.p1.x, this.p1.y);
    path.lineTo(this.p2.x, this.p2.y);
    path.lineTo(this.p3.x, this.p3.y);
    path.stroke({ width: 2, color: 0x00ff00 });

    path.position.set(100, 100);
    this.app.stage.addChild(path);

    const bezier = new PIXI.Graphics();
    bezier.moveTo(this.p0.x, this.p0.y);
    bezier.bezierCurveTo(
      this.p1.x,
      this.p1.y,
      this.p2.x,
      this.p2.y,
      this.p3.x,
      this.p3.y,
    );
    bezier.stroke({ width: 2, color: 0xff0000 });
    // bezier.fill(0x00ff00);
    // bezier.closePath();
    bezier.position.set(100, 100);
    this.app.stage.addChild(bezier);

    const interval = 1 / 10;
    for (let t = 0; t <= 1; t += interval) {
      const point = getCubicBezierPoint(t, this.p0, this.p1, this.p2, this.p3);
      const circle = new PIXI.Graphics();
      circle.circle(0, 0, 5);
      circle.fill(0x0000ff);
      circle.position.set(point.x + 100, point.y + 100);
      this.app.stage.addChild(circle);
    }

    this.animatedCircle = new PIXI.Graphics();
    this.animatedCircle.circle(0, 0, 10);
    this.animatedCircle.stroke({ width: 2, color: 0xff00ff });
    this.animatedCircle.position.set(this.p0.x + 100, this.p0.y + 100);
    this.app.stage.addChild(this.animatedCircle);

    const animationData = { t: 0 };

    this.tween = new TWEEN.Tween(animationData)
      .to({ t: 1 }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        const point = getCubicBezierPoint(
          animationData.t,
          this.p0,
          this.p1,
          this.p2,
          this.p3,
        );
        this.animatedCircle.position.set(point.x + 100, point.y + 100);
      })
      .yoyo(true)
      .repeat(Infinity)
      .start();

    setTimeout(() => {
      scene_manager.goToScene(this.nextScene as SceneNames);
    }, 3000);
    // this.loaded = true;
    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return; // Only update if the scene is active
    // console.log("Updating Game Scene 2 and deltaTime is", deltaTime);
    TWEEN.update();
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);
    World.remove(this.engine.world, this.platform);
    // Add any cleanup specific to Game Scene 2 here
    this.tween?.stop();
    this.animatedCircle.destroy();
  }
}
