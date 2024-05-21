import * as PIXI from "pixi.js";
export const getCubicBezierPoint = (
  t: number,
  p0: PIXI.Point,
  p1: PIXI.Point,
  p2: PIXI.Point,
  p3: PIXI.Point,
): PIXI.Point => {
  const x =
    (1 - t) ** 3 * p0.x +
    3 * (1 - t) ** 2 * t * p1.x +
    3 * (1 - t) * t ** 2 * p2.x +
    t ** 3 * p3.x;
  const y =
    (1 - t) ** 3 * p0.y +
    3 * (1 - t) ** 2 * t * p1.y +
    3 * (1 - t) * t ** 2 * p2.y +
    t ** 3 * p3.y;
  return new PIXI.Point(x, y);
};
