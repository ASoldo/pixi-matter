import "./style.css";
import { buttonPressed } from "./utils/input";
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
