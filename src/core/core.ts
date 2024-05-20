// src/core/core.ts
import * as PIXI from "pixi.js";
import { SceneManager } from "./scene_manager";
import { Engine, Render, Runner } from "matter-js";

/**
 * PIXI Application
 * This is the main application object
 */
export const app = new PIXI.Application();

/**
 * Runner for Matter.js
 * This is the main runner object for Matter.js
 */
export const runner = Runner.create();

/**
 * Engine for Matter.js
 * This is the main engine object for Matter.js
 */
export const engine = Engine.create();

/**
 * Render for Matter.js
 * This is the main render object for Matter.js
 */
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

/**
 * Scene Manager for the scene management
 */
export const scene_manager = new SceneManager(app, engine, matterRender);
