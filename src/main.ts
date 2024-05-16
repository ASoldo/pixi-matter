import "./style.css";
import { initDevtools } from "@pixi/devtools";
import { SceneManager } from "./scenes/scene_manager";
import { GameScene1 } from "./scenes/game_scene1";
import { GameScene2 } from "./scenes/game_scene2";
import { GameScene3 } from "./scenes/game_scene3";
import { buttonPressed } from "./utils/input";
import * as PIXI from "pixi.js";
import { Engine, Render, Runner } from "matter-js";

export const app = new PIXI.Application();
export let scene_manager = new SceneManager(app, null as any, null as any);
(async () => {
  const runner = Runner.create();
  const engine = Engine.create();
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    autoDensity: true,
    backgroundAlpha: 1,
  });

  const matterRender = Render.create({
    element: document.getElementById("matter-debug-container") as HTMLElement,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: true,
      showCollisions: true,
      showAxes: true,
      hasBounds: true,
      // showDebug: true,
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

  // Setup input handlers
  const setupButton = (element: HTMLElement, key: string) => {
    element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    element.addEventListener("pointerdown", () => buttonPressed(key, true));
    element.addEventListener("pointerup", () => buttonPressed(key, false));
    element.addEventListener("pointerout", () => buttonPressed(key, false));
  };

  document.querySelectorAll("[data-action]").forEach((element) => {
    const action = element.getAttribute("data-action");
    if (action) {
      let key = "";
      switch (action) {
        case "left-arrow":
          key = "ArrowLeft";
          break;
        case "right-arrow":
          key = "ArrowRight";
          break;
        case "up-arrow":
          key = "ArrowUp";
          break;
        case "down-arrow":
          key = "ArrowDown";
          break;
        case "button-a":
          key = "Space";
          break;
        case "button-b":
          key = "Enter";
          break;
      }
      if (key) {
        setupButton(element as HTMLElement, key);
      }
    }
  });

  document
    .getElementById("pixi-container")
    ?.appendChild(app.canvas as HTMLCanvasElement);

  Render.run(matterRender);
  Runner.run(runner, engine);
  if (matterRender.canvas) {
    matterRender.canvas.style.background = "transparent";
    matterRender.canvas.style.width = "100%";
  }

  scene_manager = new SceneManager(app, engine, matterRender);
  scene_manager.addScene("scene1", new GameScene1(app, engine, matterRender));
  scene_manager.addScene("scene2", new GameScene2(app, engine, matterRender));
  scene_manager.addScene("scene3", new GameScene3(app, engine, matterRender));

  // Default to start with scene
  scene_manager.goToScene("scene1");

  app.ticker.add((delta: PIXI.Ticker) => {
    scene_manager.update(delta.deltaTime);
  });

  initDevtools({
    app,
  });
})();
