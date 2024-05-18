// utils/input.ts
export const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

export const simulateKeyEvent = (keyCode: any, type: any): void => {
  const event = new KeyboardEvent(type, {
    key: keyCode,
    code: keyCode,
    which: keyCode.charCodeAt(0),
    bubbles: true,
    cancelable: true,
  });

  window.dispatchEvent(event);
};

export const buttonPressed = (keyCode: any, isPressed: boolean): void => {
  if (isPressed) {
    simulateKeyEvent(keyCode, "keydown");
  } else {
    simulateKeyEvent(keyCode, "keyup");
  }
};

// Setup input handlers
export const setupButton = (element: HTMLElement, key: string): void => {
  element.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  element.addEventListener("pointerdown", () => buttonPressed(key, true));
  element.addEventListener("pointerup", () => buttonPressed(key, false));
  element.addEventListener("pointerout", () => buttonPressed(key, false));
};
