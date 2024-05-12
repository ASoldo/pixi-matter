// base_scene.ts
import * as PIXI from "pixi.js";
import { Engine, Render, World } from "matter-js";

export abstract class BaseScene {
  protected app: PIXI.Application;
  protected engine: Engine;
  protected render: Render;
  protected active: boolean;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    this.app = app;
    this.engine = engine;
    this.render = render;
    this.active = false;
  }

  abstract init(): void;
  abstract update(deltaTime: number): void;
  abstract destroy(): void;

  start(): void {
    console.log("Scene started");
    this.active = true;
  }

  stop(): void {
    console.log("Scene stopped");
    this.active = false;
  }

  unload(): void {
    this.app.stage.removeChildren(); // Remove all children from the PIXI stage
    this.engine.world.bodies.forEach((body) => {
      World.remove(this.engine.world, body); // Remove all bodies from Matter world
    });
    this.destroy(); // Call destroy for any additional cleanup
  }
}
