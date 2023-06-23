import { argon2id } from "argon2";
import * as argon2 from "argon2";

const PARALLELISM = 1;
const MEMORY_COST = 65536;
const TIME_COST = 4;

export class PasswordService {
    async hashPassword(password: string): Promise<string> {
        return argon2.hash(password, {
            type: argon2id,
            parallelism: PARALLELISM,
            memoryCost: MEMORY_COST,
            timeCost: TIME_COST,
        });
    }

    async verifyPassword(hash: string, password: string): Promise<boolean> {
        return argon2.verify(hash, password);
    }
}
