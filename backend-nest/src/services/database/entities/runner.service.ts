import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {Runner} from "@prisma/client";

@Injectable()
export class RunnerService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getPublicRunners(): Promise<Runner[]> {
        const runners = await this.prisma.runner.findMany({
            where: {
                race: {
                    isPublic: true,
                },
            },
            orderBy: {
                id: "asc",
            },
        });

        return runners;
    }
}
