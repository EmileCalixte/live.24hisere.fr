import { Injectable } from "@nestjs/common";
import { DrizzleService } from "./drizzle.service";

@Injectable()
export abstract class EntityService {
    constructor(protected readonly drizzleService: DrizzleService) {}

    get db(): ReturnType<typeof this.drizzleService.getDb> {
        return this.drizzleService.getDb();
    }

    protected getUniqueResult<T>(result: T[]): T | null {
        if (result.length < 1) {
            return null;
        }

        return result[0];
    }
}
