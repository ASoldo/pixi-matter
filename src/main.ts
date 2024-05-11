import "./style.css";
import { engine, matterRender, runner } from "./app";

import { Render, Runner } from "matter-js";

Render.run(matterRender);
Runner.run(runner, engine);
if (matterRender.canvas) {
  matterRender.canvas.style.background = "transparent";
}
