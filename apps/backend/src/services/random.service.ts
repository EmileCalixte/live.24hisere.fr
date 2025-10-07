import { Injectable } from "@nestjs/common";
import * as crypto from "node:crypto";

export const DIGITS = "0123456789";
export const HEXADECIMAL = "0123456789abcdef";
export const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
export const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const ALL_CASE = LOWERCASE + UPPERCASE;
const ALL_CASE_AND_DIGITS = ALL_CASE + DIGITS;

@Injectable()
export class RandomService {
  getRandomString(length: number, availableCharacters: string = ALL_CASE_AND_DIGITS): string {
    const randomStringCharacters: string[] = [];

    for (let i = 0; i < length; i += 1) {
      randomStringCharacters.push(availableCharacters[this.getRandomInt(0, availableCharacters.length)]);
    }

    return randomStringCharacters.join("");
  }

  getRandomInt(min: number, max: number): number {
    return crypto.randomInt(min, max);
  }
}
