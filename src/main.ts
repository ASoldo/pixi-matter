import "./style.css";
import * as PIXI from "pixi.js";
import { Engine, Render, Runner } from "matter-js";
import { game_scene1 } from "./scenes/game_scene1";
export const engine = Engine.create();
export const matterRender = Render.create({
  element: document.getElementById("matter-debug-container") as HTMLElement,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: true,
    background: "transparent",
  },
});
export const runner = Runner.create();
export const app = new PIXI.Application();
(async () => {
  await app.init({
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundAlpha: 1,
    resizeTo: window,
  });
  document
    .getElementById("pixi-container")
    ?.appendChild(app.canvas as HTMLCanvasElement);
  const gameScene = new game_scene1(engine, matterRender);
  Render.run(matterRender);
  Runner.run(runner, engine);
  if (matterRender.canvas) {
    matterRender.canvas.style.background = "transparent";
  }

  app.ticker.add((delta: PIXI.Ticker) => gameScene.update(delta.deltaTime));
  app.start();
  (globalThis as any).__PIXI_APP__ = app;
  // (globalThis as any).__PIXI_STAGE__ = stage;
  // (globalThis as any).__PIXI_RENDERER__ = renderer;
})();
