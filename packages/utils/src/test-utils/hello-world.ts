import { type Toto } from "./test-type";

export function helloWorld(text: Toto = "world"): string {
    return `Hello ${text}!`;
}
