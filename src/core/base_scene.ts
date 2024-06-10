import * as PIXI from "pixi.js";
import { Engine, Render, World } from "matter-js";

export abstract class BaseScene {
  protected app: PIXI.Application;
  protected engine: Engine;
  protected render: Render;
  protected active: boolean;
  protected loaded: boolean; // Flag to track if the scene is fully loaded
  public name: string;
  protected nextScene?: string;
  protected sceneNames?: string[];

  constructor(
    app: PIXI.Application,
    engine: Engine,
    render: Render,
    nextScene?: string,
    sceneNames?: string[],
  ) {
    this.app = app;
    this.engine = engine;
    this.render = render;
    this.active = false;
    this.loaded = false;
    this.name = "";
    this.nextScene = nextScene;
    this.sceneNames = sceneNames;
  }

  abstract init(): Promise<void>;
  abstract update(deltaTime: number): Promise<void>;
  abstract destroy(): Promise<void>;
  abstract preload(): Promise<void>;

  start(): void {
    console.log("Scene started: ", this.name);
    this.active = true;
  }

  stop(): void {
    console.log("Scene stopped: ", this.name);
    this.active = false;
  }

  async unload(): Promise<void> {
    this.app.stage.removeChildren(); // Remove all children from the PIXI stage
    this.engine.world.bodies.forEach((body) => {
      World.remove(this.engine.world, body); // Remove all bodies from Matter world
    });
    await this.destroy(); // Call destroy for any additional cleanup
    this.loaded = false; // Reset the loaded flag
  }

  isActive(): boolean {
    return this.active;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  setLoaded(loaded: boolean): void {
    this.loaded = loaded;
  }
}
