import { BaseScene } from "../core/base_scene";
import * as PIXI from "pixi.js";
import Matter, {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Events,
  Composite,
} from "matter-js";
import { sound } from "@pixi/sound";
import { app } from "../core/main";
import { keys } from "../system/inputs/input";

// import { sineFunc } from "../components/behaviours/behaviours";
import { scene_manager } from "../core/main";
import { SceneNames } from "../system/types/scene_names";

export class GameScene1 extends BaseScene {
  private bunny!: PIXI.Sprite;
  private bunnyBody!: Matter.Body;
  private trigger!: Matter.Body;
  private platform!: Matter.Body;
  private canJump: boolean = false;
  // private startTime!: number;
  private score: number = 0;
  private scoreText!: PIXI.Text;
  private groundComposite!: Matter.Composite;
  private coins: Matter.Body[] = [];
  private collisionStartHandler!: (
    event: Matter.IEventCollision<Matter.Engine>,
  ) => void;
  private collisionEndHandler!: (
    event: Matter.IEventCollision<Matter.Engine>,
  ) => void;

  constructor(app: PIXI.Application, engine: Engine, render: Render) {
    super(app, engine, render);
  }

  async preload(): Promise<void> {
    await PIXI.Assets.load("/assets/images/bunny.png");

    // Check if the sound already exists before adding it
    if (!sound.exists("hit-sound")) {
      sound.add(
        "hit-sound",
        "https://cdn.freesound.org/previews/573/573363_2393492-hq.mp3",
      );
    }
  }

  async init(): Promise<void> {
    console.log("Initializing Game: ", this.name);
    this.loaded = false;

    // Initialize game elements
    this.setup();
    this.initializeScore();
    this.setupCoins();
    // this.startTime = Date.now();

    setTimeout(() => {
      scene_manager.goToScene(SceneNames.SCENE2);
    }, 3000);
    this.setLoaded(true);
  }

  async setup() {
    this.platform = Bodies.rectangle(400, 100, 300, 30, {
      isStatic: true,
      friction: 1,
      mass: 1,
      restitution: 0.1,
      density: 0.5,
      inertia: Infinity,
      inverseInertia: Infinity,
      label: "ground",
    });
    World.add(this.engine.world, this.platform);

    this.groundComposite = Composite.create();
    const groundSections = [
      Bodies.rectangle(400, 150, 100, 10, {
        label: "ground",
        isStatic: true,
        friction: 0.001,
        frictionAir: 0.01,
        restitution: 0.0,
      }),
      Bodies.rectangle(500, 200, 100, 10, {
        label: "ground",
        isStatic: true,
        friction: 0.001,
        frictionAir: 0.01,
        restitution: 0.0,
      }),
      Bodies.rectangle(600, 250, 100, 10, {
        label: "ground",
        isStatic: true,
        friction: 0.001,
        frictionAir: 0.01,
        restitution: 0.0,
      }),
      Bodies.rectangle(400, 300, 1000, 10, {
        label: "ground",
        isStatic: true,
        friction: 0.001,
        frictionAir: 0.01,
        restitution: 0.0,
      }),
    ];
    groundSections.forEach((ground) => {
      Composite.add(this.groundComposite, ground);
    });
    World.add(this.engine.world, this.groundComposite);

    this.trigger = Bodies.rectangle(400, 0, 200, 50, {
      isSensor: true,
      isStatic: true,
    });
    World.add(this.engine.world, this.trigger);

    const bunnyTexture = await PIXI.Assets.load("/assets/images/bunny.png");
    this.bunny = new PIXI.Sprite(bunnyTexture);
    this.bunny.anchor.set(0.5);
    this.bunny.pivot.set(0.5);
    this.bunny.x = 300;
    this.bunny.y = 10;
    app.stage.addChild(this.bunny);

    this.bunnyBody = Bodies.rectangle(
      this.bunny.x,
      this.bunny.y,
      this.bunny.width,
      this.bunny.height,
      {
        inertia: Infinity,
        mass: 5,
        friction: 0.5,
        frictionAir: 0.02,
        restitution: 0.0,
        density: 0.01,
      },
    );
    World.add(this.engine.world, this.bunnyBody);

    this.collisionStartHandler = (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === this.bunnyBody && pair.bodyB.label === "Coin") {
          this.handleCoinCollection(pair.bodyB);
        } else if (
          pair.bodyB === this.bunnyBody &&
          pair.bodyA.label === "Coin"
        ) {
          this.handleCoinCollection(pair.bodyA);
        } else if (
          (pair.bodyA === this.bunnyBody && pair.bodyB === this.trigger) ||
          (pair.bodyA === this.trigger && pair.bodyB === this.bunnyBody)
        ) {
          this.bunny.tint = 0xff0000;
          this.score += 1;
          this.scoreText.text = `Score: ${this.score}`;
        } else if (
          pair.bodyA === this.bunnyBody &&
          pair.bodyB.label === "ground"
        ) {
          this.canJump = true;
        } else if (
          pair.bodyB === this.bunnyBody &&
          pair.bodyA.label === "ground"
        ) {
          this.canJump = true;
        }
      });
    };

    this.collisionEndHandler = (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA === this.bunnyBody && pair.bodyB === this.trigger) ||
          (pair.bodyA === this.trigger && pair.bodyB === this.bunnyBody)
        ) {
          this.bunny.tint = 0xffffff;
        } else if (
          pair.bodyA === this.bunnyBody &&
          pair.bodyB.label === "ground"
        ) {
          this.canJump = false;
        } else if (
          pair.bodyB === this.bunnyBody &&
          pair.bodyA.label === "ground"
        ) {
          this.canJump = false;
        }
      });
    };

    Events.on(this.engine, "collisionStart", this.collisionStartHandler);
    Events.on(this.engine, "collisionEnd", this.collisionEndHandler);
  }

  setupCoins() {
    const coinPositions = [
      { x: 50, y: 105 },
      { x: 100, y: 105 },
      { x: 150, y: 105 },
    ];

    coinPositions.forEach((pos) => {
      const coin = Bodies.circle(pos.x, pos.y, 25, {
        isSensor: true,
        isStatic: true,
        label: "Coin",
      });
      this.coins.push(coin);
      World.add(this.engine.world, coin);
    });
  }

  initializeScore() {
    this.score = 0;

    this.scoreText = new PIXI.Text({
      text: `Score: ${this.score}`,
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

  handleCoinCollection(coin: Matter.Body) {
    World.remove(this.engine.world, coin);

    this.score += 1;
    this.scoreText.text = `Score: ${this.score}`;
    sound.play("hit-sound");
  }

  async update(_deltaTime: number): Promise<void> {
    if (!this.active) return;

    // const currentTime = Date.now();
    // const elapsedTime = (currentTime - this.startTime) / 1000;

    // const amplitude = 50;
    // const frequency = 1;
    // const newY = sineFunc(200, elapsedTime, amplitude, frequency);
    // Body.setPosition(this.trigger, { x: this.trigger.position.x, y: newY });
    //
    // const frequency1 = 0.5;
    // const newY1 =
    //   200 + amplitude * Math.sin(2 * Math.PI * frequency1 * elapsedTime);
    // Body.setPosition(this.platform, { x: 100, y: newY1 });
    // Body.setVelocity(this.platform, { x: 0, y: 0 });

    const moveSpeed = 2;
    if (keys["ArrowLeft"]) {
      Body.setVelocity(this.bunnyBody, {
        x: -moveSpeed,
        y: this.bunnyBody.velocity.y,
      });
    } else if (keys["ArrowRight"]) {
      Body.setVelocity(this.bunnyBody, {
        x: moveSpeed,
        y: this.bunnyBody.velocity.y,
      });
    }

    if (keys["Space"] && this.canJump) {
      Body.setVelocity(this.bunnyBody, {
        x: this.bunnyBody.velocity.x,
        y: -10,
      });
      this.canJump = false;
    }

    if (this.bunnyBody) {
      const maxVelocityX = 3;
      const maxVelocityY = 9;
      const currentVelocity = this.bunnyBody.velocity;

      if (Math.abs(currentVelocity.x) > maxVelocityX) {
        Body.setVelocity(this.bunnyBody, {
          x: maxVelocityX * Math.sign(currentVelocity.x),
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
    }
  }

  async destroy(): Promise<void> {
    console.log("Destroying Game: ", this.name);

    // Remove PIXI objects
    app.stage.removeChild(this.bunny);
    this.bunny.destroy();
    app.stage.removeChild(this.scoreText);
    this.scoreText.destroy();

    // Remove Matter.js bodies
    World.remove(this.engine.world, this.bunnyBody);
    World.remove(this.engine.world, this.trigger);
    World.remove(this.engine.world, this.platform);
    Composite.remove(this.engine.world, this.groundComposite, true);

    // Remove coins from the world and clear the array
    this.coins.forEach((coin) => World.remove(this.engine.world, coin));
    this.coins = [];

    // Remove event listeners
    Events.off(this.engine, "collisionStart", this.collisionStartHandler);
    Events.off(this.engine, "collisionEnd", this.collisionEndHandler);

    // Clear the Matter.js world
    Composite.clear(this.engine.world, false);
  }
}
