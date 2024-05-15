// loading_screen.ts
import { BaseScene } from "./base_scene";
import * as PIXI from "pixi.js";
import { Engine, Render } from "matter-js";

export class LoadingScreen extends BaseScene {
  private loadingText?: PIXI.Text;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
    this.name = "LoadingScreen";
  }
  async init(): Promise<void> {
    this.loadingText = new PIXI.Text({
      text: "Loading...",
      style: {
        fontSize: 36,
        fontFamily: "Arial",
        fill: 0xffffff,
      },
    });
    this.loadingText.anchor.set(0.5);
    this.loadingText.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2,
    );
    this.app.stage.addChild(this.loadingText);
  }

  update(deltaTime: number): void {
    // Optionally add some loading animation logic here
    if (this.loadingText) this.loadingText.rotation += deltaTime * 0.05;
  }

  destroy(): void {
    if (this.loadingText) this.app.stage.removeChild(this.loadingText);
    this.loadingText?.destroy();
  }
}
