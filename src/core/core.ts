// src/core/core.ts
import * as PIXI from "pixi.js";
import { SceneManager } from "./scene_manager";
import { Engine, Render, Runner } from "matter-js";
import { setupButton } from "../system/inputs/input";

export const app = new PIXI.Application();

export const runner = Runner.create();
export const engine = Engine.create();
export const matterRender = Render.create({
  element: document.getElementById("matter-debug-container") as HTMLElement,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: true,
    showCollisions: true,
    showAxes: true,
    hasBounds: true,
    showVelocity: true,
    showConvexHulls: true,
    showAngleIndicator: true,
    showIds: true,
    showBounds: true,
    background: "transparent",
  },
});

export const scene_manager = new SceneManager(app, engine, matterRender);

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
