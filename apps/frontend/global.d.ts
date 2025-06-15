import type { umami as UmamiType } from "umami";

declare global {
  interface Window {
    umami: UmamiType;
  }
}
