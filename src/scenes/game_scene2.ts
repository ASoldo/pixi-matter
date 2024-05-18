import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import Matter, { Engine, Render, World, Bodies } from "matter-js";
import { scene_manager } from "../core/main";
import { SceneNames } from "../system/types/scene_names";

export class GameScene2 extends BaseScene {
  protected platform!: Matter.Body;
  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
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
    setTimeout(() => {
      scene_manager.goToScene(SceneNames.SCENE3);
    }, 3000);
    // this.loaded = true;
    this.setLoaded(true);
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return; // Only update if the scene is active
    // console.log("Updating Game Scene 2 and deltaTime is", deltaTime);
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);
    // Add any cleanup specific to Game Scene 2 here
  }
}
