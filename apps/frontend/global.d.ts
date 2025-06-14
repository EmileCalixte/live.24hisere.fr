// pour faire reconnaître le fichier comme un module
import type { umami as UmamiType } from "umami";

export {}; // pour faire reconnaître le fichier comme un module

declare global {
  interface Window {
    umami: UmamiType;
  }
}
