// main.ts
import "./style.css";
import { initDevtools } from "@pixi/devtools";
import { SceneManager } from "./scenes/scene_manager";
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
  const leftArrow = document.getElementById("left-arrow"); // Add class "left-arrow" to your left arrow button
  const rightArrow = document.getElementById("right-arrow"); // Add class "right-arrow" to your right arrow button
  const upArrow = document.getElementById("up-arrow"); // Add class "up-arrow" to your up arrow button
  const downArrow = document.getElementById("down-arrow"); // Add class "down-arrow" to your down arrow button
  const buttonA = document.getElementById("button-a"); // Add class "button-a" to your A button
  const buttonB = document.getElementById("button-b"); // Add class "button-b" to your B button

  leftArrow?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  leftArrow?.addEventListener("pointerdown", () =>
    buttonPressed("ArrowLeft", true),
  );
  leftArrow?.addEventListener("pointerup", () =>
    buttonPressed("ArrowLeft", false),
  );
  leftArrow?.addEventListener("pointerout", () =>
    buttonPressed("ArrowLeft", false),
  );

  rightArrow?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  rightArrow?.addEventListener("pointerdown", () =>
    buttonPressed("ArrowRight", true),
  );
  rightArrow?.addEventListener("pointerup", () =>
    buttonPressed("ArrowRight", false),
  );
  rightArrow?.addEventListener("pointerout", () =>
    buttonPressed("ArrowRight", false),
  );

  upArrow?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  upArrow?.addEventListener("pointerdown", () =>
    buttonPressed("ArrowUp", true),
  );
  upArrow?.addEventListener("pointerup", () => buttonPressed("ArrowUp", false));
  upArrow?.addEventListener("pointerout", () =>
    buttonPressed("ArrowUp", false),
  );

  downArrow?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  downArrow?.addEventListener("pointerdown", () =>
    buttonPressed("ArrowDown", true),
  );
  downArrow?.addEventListener("pointerup", () =>
    buttonPressed("ArrowDown", false),
  );
  downArrow?.addEventListener("pointerout", () =>
    buttonPressed("ArrowDown", false),
  );

  buttonA?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  buttonA?.addEventListener("pointerdown", () => buttonPressed("Space", true));
  buttonA?.addEventListener("pointerup", () => buttonPressed("Space", false));
  buttonA?.addEventListener("pointerout", () => buttonPressed("Space", false));

  buttonB?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  buttonB?.addEventListener("pointerdown", () => buttonPressed("Enter", true));
  buttonB?.addEventListener("pointerup", () => buttonPressed("Enter", false));

  buttonB?.addEventListener("pointerout", () => buttonPressed("Enter", false));
  // Repeat for right, up, and down arrows
  document
    .getElementById("pixi-container")
    ?.appendChild(app.canvas as HTMLCanvasElement);
  // const gameScene = new game_scene1(engine, matterRender);
  Render.run(matterRender);
  Runner.run(runner, engine);
  if (matterRender.canvas) {
    matterRender.canvas.style.background = "transparent";
    matterRender.canvas.style.width = "100%";
  }
  scene_manager = new SceneManager(app, engine, matterRender);
  scene_manager.addScene("scene2", new GameScene2(app, engine, matterRender));
  scene_manager.addScene("scene3", new GameScene3(app, engine, matterRender));

  // Default to start with scene1
  // scene_manager.goToScene("scene2");
  scene_manager.jumpToScene("scene3");

  app.ticker.add((delta: PIXI.Ticker) => {
    scene_manager.update(delta.deltaTime);
  });

  initDevtools({
    app,
  });
})();
