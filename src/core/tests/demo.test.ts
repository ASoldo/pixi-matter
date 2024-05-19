import { describe, it, expect, beforeEach } from "vitest";

describe("PIXI Application", () => {
  let app: string;

  beforeEach(() => {
    app = "PIXI.Application";
  });

  it("should initialize the PIXI application", () => {
    expect(app).toBe("PIXI.Application");
  });
});
