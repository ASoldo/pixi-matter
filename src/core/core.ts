// src/core/core.ts
import * as PIXI from "pixi.js";
import { SceneManager } from "./scene_manager";
import { Engine, Render, Runner } from "matter-js";

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
