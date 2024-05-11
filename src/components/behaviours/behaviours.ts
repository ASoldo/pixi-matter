export function sineFunc(
  initialY: number,
  time: number,
  amplitude: number,
  frequency: number,
): number {
  return initialY + amplitude * Math.sin(2 * Math.PI * frequency * time); // PI/2 to start at the peak
}
