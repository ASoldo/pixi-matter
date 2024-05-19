import "./style.css";
import { initDevtools } from "@pixi/devtools";
import { setupBridge } from "./system/bridge/bridge";
import { GameScene1 } from "./scenes/game_scene1";
import { GameScene2 } from "./scenes/game_scene2";
import { GameScene3 } from "./scenes/game_scene3";
import { GameScene4 } from "./scenes/game_scene4";
import * as PIXI from "pixi.js";
import { Render, Runner } from "matter-js";
import { SceneNames } from "./system/types/scene_names";

import { app, scene_manager, matterRender, engine, runner } from "./core/core";

(async () => {
  try {
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

    app.canvas.style.width = "100%";
    app.canvas.style.height = "inherit";

    document
      .getElementById("pixi-container")
      ?.appendChild(app.canvas as HTMLCanvasElement);

    Render.run(matterRender);
    Runner.run(runner, engine);
    if (matterRender.canvas) {
      matterRender.canvas.style.background = "transparent";
      matterRender.canvas.style.width = "100%";
    }

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
    console.log("App initialized successfully");
  } catch (error) {
    console.log("Error initializing app", error);
  }
})();
