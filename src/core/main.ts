import "../style.css";
import { initDevtools } from "@pixi/devtools";
import { setupBridge } from "../system/bridge/bridge";
import { SceneManager } from "./scene_manager";
import { GameScene1 } from "../scenes/game_scene1";
import { GameScene2 } from "../scenes/game_scene2";
import { GameScene3 } from "../scenes/game_scene3";
import { GameScene4 } from "../scenes/game_scene4";
import { setupButton } from "../system/inputs/input";
import * as PIXI from "pixi.js";
import { Engine, Render, Runner } from "matter-js";
import { SceneNames } from "../system/types/scene_names";

export const app = new PIXI.Application();
export let scene_manager: SceneManager;
(async () => {
  const runner = Runner.create();
  const engine = Engine.create();
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    autoDensity: true,
    backgroundAlpha: 1,
    preference: "webgl",
  });
  app.ticker.maxFPS = 120;
  app.ticker.minFPS = 120;

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
  scene_manager.addScene(
    SceneNames.SCENE1,
    new GameScene1(app, engine, matterRender),
  );
  scene_manager.addScene(
    SceneNames.SCENE2,
    new GameScene2(app, engine, matterRender),
  );
  scene_manager.addScene(
    SceneNames.SCENE3,
    new GameScene3(app, engine, matterRender),
  );
  scene_manager.addScene(
    SceneNames.SCENE4,
    new GameScene4(app, engine, matterRender),
  );

  setupBridge(app, scene_manager);

  // Default to start with scene
  scene_manager.goToScene(SceneNames.SCENE4);

  app.ticker.add((delta: PIXI.Ticker) => {
    scene_manager.update(delta.deltaTime);
  });

  initDevtools({
    app,
  });
})();
