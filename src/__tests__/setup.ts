import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: () => {},
  },
});

Object.defineProperty(globalThis, "history", {
  value: {
    pushState: () => {},
  },
});

