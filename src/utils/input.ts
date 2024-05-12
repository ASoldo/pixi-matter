// utils/input.ts
export const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

export function simulateKeyEvent(keyCode: any, type: any) {
  const event = new KeyboardEvent(type, {
    key: keyCode,
    code: keyCode,
    which: keyCode.charCodeAt(0),
    bubbles: true,
    cancelable: true,
  });

  window.dispatchEvent(event);
}

export function buttonPressed(keyCode: any, isPressed: boolean) {
  if (isPressed) {
    simulateKeyEvent(keyCode, "keydown");
  } else {
    simulateKeyEvent(keyCode, "keyup");
  }
}
