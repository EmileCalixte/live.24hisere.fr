import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {Prisma, Runner} from "@prisma/client";

@Injectable()
export class RunnerService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getRunner(where: Prisma.RunnerWhereUniqueInput): Promise<Runner | null> {
        return this.prisma.runner.findUnique({
            where,
        });
    }

    async getPublicRunners(): Promise<Runner[]> {
        return this.prisma.runner.findMany({
            where: {
                race: {
                    isPublic: true,
                },
            },
            orderBy: {
                id: "asc",
            },
        });
    }
}
