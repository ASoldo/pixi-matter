// scene_manager.ts
import { BaseScene } from "./base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";

export class SceneManager {
  private app: PIXI.Application;
  private engine: Engine;
  private render: Render;
  private scenes: { [key: string]: BaseScene };
  private currentScene: BaseScene | null;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    this.app = app;
    this.engine = engine;
    this.render = render;
    this.scenes = {};
    this.currentScene = null;
  }

  debug() {
    console.log("App: ", this.app);
    console.log("Engine: ", this.engine);
    console.log("Render: ", this.render);
  }

  addScene(name: string, scene: BaseScene): void {
    this.scenes[name] = scene;
  }

  goToScene(name: string): void {
    if (this.currentScene) {
      this.currentScene.stop();
      // this.currentScene.destroy();
      this.currentScene.unload();
    }

    const scene = this.scenes[name];
    if (scene) {
      scene.init();
      scene.start();
      this.currentScene = scene;
    }
  }

  update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }
}
