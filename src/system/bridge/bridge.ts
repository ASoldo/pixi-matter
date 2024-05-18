import { Application } from "pixi.js";
import { SceneManager } from "../../core/scene_manager";

// src/bridge/bridge.ts
export function setupBridge(
  _app: Application,
  sceneManager: SceneManager,
): void {
  window.addEventListener("message", (event: MessageEvent): void => {
    const { message, payload } = event.data;

    switch (message) {
      case "EndGame":
        if (payload?.Score !== undefined) {
          // Call a method in your scene manager or app to handle the end game logic
          console.log(`EndGame message received with Score: ${payload.Score}`);
          sceneManager.score = payload.Score;
          console.log("SceneManager score:", sceneManager.score);
        }
        break;

      case "Signal":
        console.log("Signal from frontend received!");
        if (payload?.Score !== undefined) {
          // Call a method in your scene manager or app to handle the signal
          console.log(`StartGame with Score: ${payload.Score}`);
        }
        break;

      // default:
      //   console.log("Unknown message received:", message);
      //   break;
    }
  });
  console.log("Bridge setup complete!");
}

// Demo usage:
// window.postMessage({
//   message: "EndGame",
//   payload: { Score: 150 }
// }, '*');
