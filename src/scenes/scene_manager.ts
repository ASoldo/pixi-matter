// scene_manager.ts
import { BaseScene } from "./base_scene";
import { LoadingScreen } from "./loading_screen";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";

export class SceneManager {
  private app: PIXI.Application;
  private engine: Engine;
  private render: Render;
  private scenes: { [key: string]: BaseScene };
  private currentScene: BaseScene | null;
  private loadingScene: LoadingScreen;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    this.app = app;
    this.engine = engine;
    this.render = render;
    this.scenes = {};
    this.currentScene = null;
    this.loadingScene = new LoadingScreen(app, engine, render);
  }

  debug() {
    console.log("App: ", this.app);
    console.log("Engine: ", this.engine);
    console.log("Render: ", this.render);
  }

  addScene(name: string, scene: BaseScene): void {
    this.scenes[name] = scene;
    scene.name = name;
  }

  // async goToScene(name: string): Promise<void> {
  //   if (this.currentScene) {
  //     this.currentScene.stop();
  //     await this.currentScene.unload();
  //   }
  //
  //   this.loadingScene.init();
  //   this.loadingScene.start();
  //
  //   const scene = this.scenes[name];
  //   if (scene) {
  //     await new Promise<void>(async (resolve) => {
  //       // Preload the scene
  //       await scene.preload();
  //
  //       setTimeout(async () => {
  //         this.loadingScene.stop();
  //         await this.loadingScene.unload();
  //         await scene.init();
  //         scene.start();
  //         this.currentScene = scene;
  //         resolve();
  //       }, 1000); // Simulate loading delay, replace with actual loading logic
  //     });
  //   }
  // }

  async goToScene(name: string): Promise<void> {
    if (this.currentScene) {
      this.currentScene.stop();
      this.currentScene.unload();
    }

    this.loadingScene.init();
    this.loadingScene.start();

    const scene = this.scenes[name];
    if (scene) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          this.loadingScene.stop();
          this.loadingScene.unload();
          scene.init();
          scene.start();
          this.currentScene = scene;
          resolve();
        }, 1000); // Simulate loading delay, replace with actual loading logic
      });
    }
  }

  jumpToScene(name: string): void {
    if (this.currentScene) {
      this.currentScene.stop();
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
    if (this.loadingScene && this.loadingScene.isActive()) {
      this.loadingScene.update(deltaTime);
    } else if (this.currentScene) {
      this.currentScene.update(deltaTime);
      Engine.update(this.engine, (deltaTime * 1000) / 60);
    }
  }
}
