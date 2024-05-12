import "./style.css";
import * as PIXI from "pixi.js";
import { Engine, Render, Runner } from "matter-js";
import { game_scene1 } from "./scenes/game_scene1";
export const app = new PIXI.Application();
(async () => {
  const runner = Runner.create();
  const engine = Engine.create();
  await app.init({
    width: 600,
    height: 800,
    backgroundColor: 0x1099bb,
    // resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundAlpha: 1,
    // resizeTo: window,
    // canvas: document.getElementById(
    //   "pixi-container.canvas",
    // ) as HTMLCanvasElement,
  });
  const matterRender = Render.create({
    element: document.getElementById("matter-debug-container") as HTMLElement,
    engine: engine,
    options: {
      width: 600,
      height: 800,
      wireframes: true,
      showCollisions: true,
      showAxes: true,
      hasBounds: true,
      showDebug: true,
      showVelocity: true,
      showConvexHulls: true,
      showAngleIndicator: true,
      showIds: true,
      showBounds: true,
      background: "transparent",
    },
  });
  app.canvas.style.width = "100%";
  app.canvas.style.height = "inherit";

  document
    .getElementById("pixi-container")
    ?.appendChild(app.canvas as HTMLCanvasElement);
  const gameScene = new game_scene1(engine, matterRender);
  Render.run(matterRender);
  Runner.run(runner, engine);
  if (matterRender.canvas) {
    matterRender.canvas.style.background = "transparent";
    matterRender.canvas.style.width = "100%";
  }

  app.ticker.add((delta: PIXI.Ticker) => gameScene.update(delta.deltaTime));
  app.start();
  (globalThis as any).__PIXI_APP__ = app;
  // (globalThis as any).__PIXI_STAGE__ = stage;
  // (globalThis as any).__PIXI_RENDERER__ = renderer;
})();
