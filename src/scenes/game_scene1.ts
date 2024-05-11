import { sound } from "@pixi/sound";
import * as PIXI from "pixi.js";
// import Alpine from "alpinejs";
import {
  Engine,
  World,
  Bodies,
  Body,
  Events,
  Render,
  Composite,
} from "matter-js";
import { app } from "../app";
import { keys } from "../utils/input";
import { sineFunc } from "../components/behaviours/behaviours";

export class game_scene1 {
  private engine!: Engine;
  private bunny!: PIXI.Sprite;
  private bunnyBody!: Matter.Body;
  private trigger!: Matter.Body;
  private render!: Matter.Render;
  // private bodies: any = Alpine.reactive({ data: [] });
  private canJump: boolean = false;
  private startTime: number;
  private platform!: Matter.Body;
  // private gizmos!: Matter.Body;
  private score!: 0;
  private scoreText: PIXI.Text = new PIXI.Text({
    text: "Score: 0",
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    },
  });

  constructor(engine: Engine, render: Render) {
    this.engine = engine;
    this.render = render;
    Render.run(this.render);
    this.initializeGame();
    this.setupCoins();
    this.startTime = Date.now();
  }

  async initializeGame() {
    await this.setup();
    this.initializeScore();
  }

  setupCoins() {
    // Create multiple coins
    const coinPositions = [
      { x: 650, y: 1050 },
      { x: 750, y: 1050 },
      { x: 850, y: 1050 }, // Add as many positions as you need
    ];

    coinPositions.forEach((pos) => {
      const coin = Bodies.circle(pos.x, pos.y, 25, {
        isSensor: true, // Triggers events but no physical collisions
        isStatic: true, // Remains stationary
        label: "Coin",
      });
      World.add(this.engine.world, coin);
    });
  }

  initializeScore() {
    this.score = 0;

    // Create a PIXI text object for the score
    this.scoreText = new PIXI.Text({
      text: "Score: 0",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
      },
    });
    this.scoreText.x = 20;
    this.scoreText.y = 20;
    app.stage.addChild(this.scoreText);
  }

  handleCoinCollection(coin: any) {
    // Remove the coin from the world to simulate collection
    World.remove(this.engine.world, coin);

    // Increment score
    this.score += 1;
    this.scoreText.text = `Score: ${this.score}`;
    sound.play("hit-sound");
  }

  async setup() {
    sound.add("hit-sound", "/assets/hit-sound.mp3");
    // sound.play("hit-sound");
    this.platform = Bodies.rectangle(400, 1000, 300, 30, {
      isStatic: false, // Make sure it is dynamic
      friction: 1, // High friction so objects don't slide off
      mass: 1,
      restitution: 0.1, // Low restitution to prevent bouncing
      density: 0.5, // Set density to a reasonable value to prevent heavy impacts
      inertia: Infinity,
      inverseInertia: Infinity,
      label: "ground",
    });
    World.add(this.engine.world, this.platform);
    // this.gizmos = Bodies.rectangle(400, 800, 30, 30, {
    //   mass: 5,
    //   isStatic: false, // Make sure it is dynamic
    //   // friction: 1, // High friction so objects don't slide off
    //   restitution: 0.01, // Low restitution to prevent bouncing
    //   density: 0.01, // Set density to a reasonable value to prevent heavy impacts
    //   inertia: Infinity,
    //   label: "ground",
    // });
    // World.add(this.engine.world, this.gizmos);
    const groundComposite = Composite.create();
    const groundSections = [
      Bodies.rectangle(400, 1150, 1000, 10, {
        label: "ground",
        isStatic: true,
        friction: 0.001,
        frictionAir: 0.01,
        restitution: 0.0,
      }),
      Bodies.rectangle(1500, 1200, 1000, 10, {
        label: "ground",
        isStatic: true,
        friction: 0.001,
        frictionAir: 0.01,
        restitution: 0.0,
      }),
      Bodies.rectangle(2600, 1250, 1000, 10, {
        label: "ground",
        isStatic: true,
        friction: 0.001,
        frictionAir: 0.01,
        restitution: 0.0,
      }),
      Bodies.rectangle(400, 1300, 4510, 10, {
        label: "ground",
        isStatic: true,
        friction: 0.001,
        frictionAir: 0.01,
        restitution: 0.0,
      }),
    ];
    groundSections.forEach((ground) => {
      Composite.add(groundComposite, ground);
    });
    World.add(this.engine.world, groundComposite);

    // Setup trigger
    this.trigger = Bodies.rectangle(400, 800, 200, 50, {
      isSensor: true,
      isStatic: false,
    });
    World.add(this.engine.world, this.trigger);

    // Setup bunny
    const bunnyTexture = await PIXI.Assets.load("/assets/bunny.png");
    this.bunny = new PIXI.Sprite(bunnyTexture);
    this.bunny.anchor.set(0.5);
    this.bunny.pivot.set(0.5);
    this.bunny.x = app.screen.width / 4;
    this.bunny.y = app.screen.height / 2;
    app.stage.addChild(this.bunny);

    // When the texture is loaded, update the bunny body
    if (!bunnyTexture.valid) {
      this.bunnyBody = Bodies.rectangle(
        this.bunny.x,
        this.bunny.y,
        this.bunny.width,
        this.bunny.height,
        {
          // inverseInertia: Infinity,
          inertia: Infinity,
          mass: 5,
          friction: 0.5,
          frictionAir: 0.02,
          restitution: 0.0,
          density: 0.01,
        },
      );
      console.log(this.bunnyBody);
      World.add(this.engine.world, this.bunnyBody);
    }

    Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === this.bunnyBody && pair.bodyB.label === "Coin") {
          this.handleCoinCollection(pair.bodyB);
        } else if (
          pair.bodyB === this.bunnyBody &&
          pair.bodyA.label === "Coin"
        ) {
          this.handleCoinCollection(pair.bodyA);
        }
      });
    });

    // Collision events to change bunny color
    Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA === this.bunnyBody && pair.bodyB === this.trigger) ||
          (pair.bodyA === this.trigger && pair.bodyB === this.bunnyBody)
        ) {
          // Bunny entered the trigger
          this.bunny.tint = 0xff0000; // Change color to red for example
          this.score += 1;
          this.scoreText.text = `Score: ${this.score}`;
        }
      });
    });

    Events.on(this.engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA === this.bunnyBody && pair.bodyB === this.trigger) ||
          (pair.bodyA === this.trigger && pair.bodyB === this.bunnyBody)
        ) {
          // Bunny exited the trigger
          this.bunny.tint = 0xffffff; // Change color back to normal
        }
      });
    });
    Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === this.bunnyBody && pair.bodyB.label === "ground") {
          this.canJump = true; // Bunny is touching the ground
        } else if (
          pair.bodyB === this.bunnyBody &&
          pair.bodyA.label === "ground"
        ) {
          this.canJump = true; // Bunny is touching the ground
        }
      });
    });

    Events.on(this.engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === this.bunnyBody && pair.bodyB.label === "ground") {
          this.canJump = false; // Bunny is no longer touching the ground
        } else if (
          pair.bodyB === this.bunnyBody &&
          pair.bodyA.label === "ground"
        ) {
          this.canJump = false; // Bunny is no longer touching the ground
        }
      });
    });
  }
  update(delta: number) {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime) / 1000; // convert time to seconds

    // Apply the sine function to the trigger's Y position
    const amplitude = 50; // Height of the wave, adjust as needed
    const frequency = 1; // Cycles per second, adjust as needed
    const newY = sineFunc(1200, elapsedTime, amplitude, frequency);
    Body.setPosition(this.trigger, { x: this.trigger.position.x, y: newY });

    // Calculate new Y position for the platform
    const frequency1 = 0.5; // Slower frequency for an elevator-like movement
    const newY1 =
      1000 + amplitude * Math.sin(2 * Math.PI * frequency1 * elapsedTime);

    // Update platform position
    Body.setPosition(this.platform, { x: 400, y: newY1 });

    // Ensure the platform does not accumulate vertical velocity
    Body.setVelocity(this.platform, { x: 0, y: 0 });

    // Update the Matter.js engine
    Engine.update(this.engine, (delta * 1000) / 60);
    // this.bodies.data = this.getBodiesData();
    const moveSpeed = 2; // You can adjust this value to tweak movement speed
    if (keys["ArrowLeft"]) {
      Body.setVelocity(this.bunnyBody, {
        x: -moveSpeed,
        y: this.bunnyBody.velocity.y,
      });
      // console.log("Pressed left");
    } else if (keys["ArrowRight"]) {
      Body.setVelocity(this.bunnyBody, {
        x: moveSpeed,
        y: this.bunnyBody.velocity.y,
      });
      // console.log("Pressed right");
    }

    if (keys["Space"] && this.canJump) {
      Body.setVelocity(this.bunnyBody, {
        x: this.bunnyBody.velocity.x,
        y: -10,
      });
      this.canJump = false;
      // console.log("Pressed space");
    }

    // Sync the bunny's PIXI sprite with its Matter.js body
    if (this.bunnyBody) {
      // Cap the bunny's velocity
      const maxVelocityX = 3; // Maximum horizontal velocity
      const maxVelocityY = 7; // Maximum vertical velocity
      const currentVelocity = this.bunnyBody.velocity;
      // console.log(currentVelocity);
      // console.log(this.bunnyBody);

      // Body.setVelocity(this.bunnyBody, {
      //   x: 10, // Maintain direction
      //   y: 0,
      // });

      // Check if the current velocity exceeds maximum, and adjust
      if (Math.abs(currentVelocity.x) > maxVelocityX) {
        Body.setVelocity(this.bunnyBody, {
          x: maxVelocityX * Math.sign(currentVelocity.x), // Maintain direction
          y: currentVelocity.y,
        });
      }
      if (currentVelocity.y > maxVelocityY) {
        Body.setVelocity(this.bunnyBody, {
          x: currentVelocity.x,
          y: maxVelocityY,
        });
      } else if (currentVelocity.y < -maxVelocityY) {
        Body.setVelocity(this.bunnyBody, {
          x: currentVelocity.x,
          y: -maxVelocityY,
        });
      }
      this.bunny.x = this.bunnyBody.position.x;
      this.bunny.y = this.bunnyBody.position.y;
      // this.bunny.rotation += 0.01;
    }
  }

  getBodiesData() {
    return this.engine.world.bodies.map((body) => {
      return {
        id: body.id,
        position: body.position,
        velocity: body.velocity,
      };
    });
  }

  sceneData() {
    // return this.bodies;
  }
}
