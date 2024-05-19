// src/core/tests/demo.test.ts

import { describe, it, expect } from "vitest";
import { sineFunc } from "../../../components/behaviours/behaviours";

describe("Sine behaviour Test", () => {
  it("should be defined", () => {
    expect(sineFunc).toBeDefined();
  });

  it("should return initialY when amplitude is 0", () => {
    const result = sineFunc(10, 0, 0, 1);
    expect(result).toBe(10);
  });

  it("should return correct value at time 0 with non-zero amplitude", () => {
    const result = sineFunc(10, 0, 5, 1);
    expect(result).toBe(10);
  });

  it("should return correct value at different times", () => {
    const result1 = sineFunc(0, 0.25, 10, 1);
    const result2 = sineFunc(0, 0.5, 10, 1);
    const result3 = sineFunc(0, 0.75, 10, 1);
    const result4 = sineFunc(0, 1, 10, 1);

    expect(result1).toBeCloseTo(10, 5); // At 1/4 period, sine is 1
    expect(result2).toBeCloseTo(0, 5); // At 1/2 period, sine is 0
    expect(result3).toBeCloseTo(-10, 5); // At 3/4 period, sine is -1
    expect(result4).toBeCloseTo(0, 5); // At 1 period, sine is 0
  });

  it("should work with different frequencies", () => {
    const result = sineFunc(0, 0.25, 10, 2);
    expect(result).toBeCloseTo(0, 5); // With frequency 2, it completes a full period in half the time
  });
});
