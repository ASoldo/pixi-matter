import { BaseScene } from "./base_scene";
import * as PIXI from "pixi.js";
import Matter, { Engine, Render, World, Bodies } from "matter-js";
import { scene_manager } from "../main";

export class GameScene2 extends BaseScene {
  protected platform!: Matter.Body;
  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  init(): void {
    console.log("Initializing Game: ", this.name);
    // Add any specific initialization code for Game Scene 2 here
    this.platform = Bodies.rectangle(0, 600, 300, 300, {
      isStatic: true, // Make sure it is dynamic
      friction: 1, // High friction so objects don't slide off
      mass: 1,
      restitution: 0.1, // Low restitution to prevent bouncing
      density: 0.5, // Set density to a reasonable value to prevent heavy impacts
      inertia: Infinity,
      inverseInertia: Infinity,
      label: "ground",
    });
    World.add(this.engine.world, this.platform);
    setTimeout(() => {
      scene_manager.goToScene("scene3");
    }, 3000);
  }

  update(_deltaTime: number): void {
    if (!this.active) return; // Only update if the scene is active
    // console.log("Updating Game Scene 2 and deltaTime is", deltaTime);
    // Add specific update logic for Game Scene 2 here
  }

  destroy(): void {
    console.log("Destroying Game: ", this.name);
    // Add any cleanup specific to Game Scene 2 here
  }
}
// game_scene2.ts
// import { BaseScene } from "./base_scene";
//
// export class GameScene2 extends BaseScene {
//   init(): void {
//     // this.init();
//     console.log("Initializing Game Scene");
//     // Specific initialization code for Game Scene 1
//   }
//
//   update(deltaTime: number): void {
//     if (!this.active) return;
//     console.log("Updating Game Scene and deltaTime is", deltaTime);
//     // Specific update logic for Game Scene 1
//   }
//
//   destroy(): void {
//     console.log("Destroying Game Scene 1");
//     this.destroy();
//     // Cleanup specific to Game Scene 1
//   }
// }

// import * as PIXI from "pixi.js";
// import { Engine, World, Bodies, Body, Events, Render } from "matter-js";
// import { app } from "../main";
// import { keys } from "../utils/input";
// import { sineFunc } from "../components/behaviours/behaviours";
// import { sound } from "@pixi/sound";
// import { BaseScene } from "./base_scene";
//
// export class GameScene2 extends BaseScene {
//   private bunny!: PIXI.Sprite;
//   private bunnyBody!: Matter.Body;
//   private trigger!: Matter.Body;
//   private platform!: Matter.Body;
//   private score: number = 0;
//   private scoreText: PIXI.Text;
//   private startTime: number = 0;
//   private canJump: boolean = true;
//   init(): void {
//     console.log("Initializing Game Scene 2");
//     this.setupCoins();
//   }
//   destroy(): void {
//     console.log("Destroying Game Scene 2");
//   }
//
//   constructor(engine: Engine, render: Render) {
//     super(app, engine, render);
//     this.scoreText = new PIXI.Text("Score: 0", {
//       fontFamily: "Arial",
//       fontSize: 24,
//       fill: 0xffffff,
//     });
//     this.initializeGame();
//   }
//
//   async initializeGame(): Promise<void> {
//     this.startTime = Date.now();
//     await this.setup();
//     this.initializeScore();
//   }
//
//   setupCoins(): void {
//     const coinPositions = [
//       { x: 50, y: 105 },
//       { x: 100, y: 105 },
//       { x: 150, y: 105 }, // Add as many positions as you need
//     ];
//
//     coinPositions.forEach((pos) => {
//       const coin = Bodies.circle(pos.x, pos.y, 25, {
//         isSensor: true,
//         isStatic: true,
//         label: "Coin",
//       });
//       World.add(this.engine.world, coin);
//     });
//   }
//
//   initializeScore(): void {
//     this.scoreText.x = 20;
//     this.scoreText.y = 20;
//     app.stage.addChild(this.scoreText);
//   }
//
//   handleCoinCollection(coin: Matter.Body): void {
//     World.remove(this.engine.world, coin);
//     this.score += 1;
//     this.scoreText.text = `Score: ${this.score}`;
//     sound.play("hit-sound");
//   }
//
//   async setup(): Promise<void> {
//     sound.add("hit-sound", "/assets/hit-sound.mp3");
//     this.platform = Bodies.rectangle(400, 1000, 300, 30, {
//       isStatic: false,
//       friction: 1,
//       mass: 1,
//       restitution: 0.1,
//       density: 0.5,
//       inertia: Infinity,
//       inverseInertia: Infinity,
//       label: "ground",
//     });
//     World.add(this.engine.world, this.platform);
//
//     this.trigger = Bodies.rectangle(400, 0, 200, 50, {
//       isSensor: true,
//       isStatic: false,
//     });
//     World.add(this.engine.world, this.trigger);
//
//     const bunnyTexture = await PIXI.Assets.load("/assets/bunny.png");
//     this.bunny = new PIXI.Sprite(bunnyTexture);
//     this.bunny.anchor.set(0.5);
//     this.bunny.pivot.set(0.5);
//     this.bunny.x = 300;
//     this.bunny.y = 10;
//     app.stage.addChild(this.bunny);
//
//     if (!bunnyTexture.valid) {
//       this.bunnyBody = Bodies.rectangle(
//         this.bunny.x,
//         this.bunny.y,
//         this.bunny.width,
//         this.bunny.height,
//         {
//           inertia: Infinity,
//           mass: 5,
//           friction: 0.5,
//           frictionAir: 0.02,
//           restitution: 0.0,
//           density: 0.01,
//         },
//       );
//       World.add(this.engine.world, this.bunnyBody);
//     }
//
//     Events.on(this.engine, "collisionStart", (event) => {
//       event.pairs.forEach((pair) => {
//         if (pair.bodyA === this.bunnyBody && pair.bodyB.label === "Coin") {
//           this.handleCoinCollection(pair.bodyB);
//         } else if (
//           pair.bodyB === this.bunnyBody &&
//           pair.bodyA.label === "Coin"
//         ) {
//           this.handleCoinCollection(pair.bodyA);
//         }
//       });
//     });
//   }
//
//   update(delta: number): void {
//     if (!this.active) return;
//     const currentTime = Date.now();
//     const elapsedTime = (currentTime - this.startTime) / 1000; // convert time to seconds
//
//     const amplitude = 50;
//     const frequency = 1;
//     const newY = sineFunc(200, elapsedTime, amplitude, frequency);
//     Body.setPosition(this.trigger, { x: this.trigger.position.x, y: newY });
//
//     const frequency1 = 0.5;
//     const newY1 =
//       200 + amplitude * Math.sin(2 * Math.PI * frequency1 * elapsedTime);
//     Body.setPosition(this.platform, { x: 100, y: newY1 });
//
//     if (keys["ArrowLeft"]) {
//       Body.setVelocity(this.bunnyBody, { x: -2, y: this.bunnyBody.velocity.y });
//     }
//     if (keys["ArrowRight"]) {
//       Body.setVelocity(this.bunnyBody, { x: 2, y: this.bunnyBody.velocity.y });
//     }
//     if (keys["Space"] && this.canJump) {
//       Body.setVelocity(this.bunnyBody, {
//         x: this.bunnyBody.velocity.x,
//         y: -10,
//       });
//       this.canJump = false;
//     }
//
//     this.bunny.x = this.bunnyBody.position.x;
//     this.bunny.y = this.bunnyBody.position.y;
//   }
// }
