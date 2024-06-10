import "./style.css";
import { initDevtools } from "@pixi/devtools";
import { setupBridge } from "./system/bridge/bridge";
import { GameScene1 } from "./scenes/game_scene1";
import { GameScene2 } from "./scenes/game_scene2";
import { GameScene3 } from "./scenes/game_scene3";
import { GameScene4 } from "./scenes/game_scene4";
import { GameScene5 } from "./scenes/game_scene5";
import { SplashScene } from "./core/splash_scene";
import * as PIXI from "pixi.js";
import { Render, Runner } from "matter-js";
import { SceneNames } from "./system/types/scene_names";
import { setupButton } from "./system/inputs/input";
import { fetchGameConfig } from "./api/game_config_api";

import { app, scene_manager, matterRender, engine, runner } from "./core/core";

(async () => {
  try {
    // Fetch game configuration
    const gameConfigs = await fetchGameConfig();
    const gameConfig = gameConfigs[0]; // Assuming you want the first configuration
    console.log("Game Config: ", gameConfig);
    const sceneNames = gameConfig.scenes.map((scene) => scene.scene);
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

    Render.run(matterRender);
    Runner.run(runner, engine);
    if (matterRender.canvas) {
      matterRender.canvas.style.background = "transparent";
      matterRender.canvas.style.width = "100%";
    }

    const sceneMap = [
      GameScene1,
      GameScene2,
      GameScene3,
      GameScene4,
      GameScene5,
    ];
    console.log("Scene Map: ", sceneMap);

    for (let i = 0; i < sceneMap.length; i++) {
      const sceneClass = sceneMap[i];
      const sceneName = sceneClass.name; // Get the name of the scene class

      // Find the index of the scene in the gameConfig that matches the SceneClass name
      const configSceneIndex = gameConfig.scenes.findIndex(
        (configScene) => configScene.scene === sceneName,
      );

      if (configSceneIndex !== -1) {
        // Determine the next scene index, looping back to the first scene if at the end
        const nextSceneIndex =
          (configSceneIndex + 1) % gameConfig.scenes.length;
        const nextScene = gameConfig.scenes[nextSceneIndex].scene;

        scene_manager.addScene(
          gameConfig.scenes[configSceneIndex].scene as SceneNames,
          new sceneClass(app, engine, matterRender, nextScene),
        );
        console.log(
          "Scene added: ",
          gameConfig.scenes[configSceneIndex].scene,
          " -> ",
          nextScene,
        );
      }
    }

    scene_manager.addScene(
      SceneNames.SPLASH_SCENE,
      new SplashScene(
        app,
        engine,
        matterRender,
        gameConfig.scenes[0].scene,
        sceneNames,
      ),
    );
    console.log("Scene Names: ", sceneNames);

    setupBridge(app, scene_manager);

    // Default to start with scene
    scene_manager.goToScene(SceneNames.SPLASH_SCENE);

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
