import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {Misc, Prisma} from "@prisma/client";
import {isDateValid} from "src/utils/date.utils";

const KEY_LAST_UPDATE_TIME = "last_update_time";

@Injectable()
export class MiscService {
    constructor(private readonly prisma: PrismaService) {}

    public async getLastUpdateTime(): Promise<Date | null>;
    public async getLastUpdateTime(asISOString: false): Promise<Date | null>;
    public async getLastUpdateTime(asISOString: true): Promise<DateISOString | null>;
    public async getLastUpdateTime(asISOString = false): Promise<Date | DateISOString | null> {
        const misc = await this.getLine(KEY_LAST_UPDATE_TIME);

        if (!misc) {
            return null;
        }

        const date = new Date(misc.value);

        if (!isDateValid(date)) {
            return null;
        }

        return asISOString ? date.toISOString() : date;
    }

    public async saveLastUpdateTime(lastUpdateDate: Date): Promise<void> {
        await this.saveLine(KEY_LAST_UPDATE_TIME, lastUpdateDate.toISOString());
    }

    private async getLine(key: NonNullable<Prisma.MiscWhereUniqueInput["key"]>): Promise<Misc | null> {
        return this.prisma.misc.findUnique({
            where: {key},
        });
    }

    private async saveLine(key: NonNullable<Prisma.MiscWhereUniqueInput["key"]>, value: Misc["value"]): Promise<Misc> {
        return this.prisma.misc.upsert({
            where: {
                key,
            },
            update: {
                value,
            },
            create: {
                key,
                value,
            },
        });
    }
}
