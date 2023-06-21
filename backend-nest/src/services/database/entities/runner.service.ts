import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {Prisma, Runner} from "@prisma/client";
import {PublicRunnerWithRaceAndPassages, RunnerWithRaceAndPassages} from "src/types/Runner";
import {excludeKeys, pickKeys} from "src/utils/misc.utils";

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

    async getPublicRunner(where: Prisma.RunnerWhereUniqueInput): Promise<PublicRunnerWithRaceAndPassages | null> {
        const runner = await this.prisma.runner.findUnique({
            where,
            include: {
                race: true,
                passages: true,
            },
        });

        if (!runner) {
            return null;
        }

        if (!runner.race.isPublic) {
            return null;
        }

        return this.getPublicRunnerWithRaceAndPassages(runner);
    }

    private getPublicRunnerWithRaceAndPassages(runner: RunnerWithRaceAndPassages): PublicRunnerWithRaceAndPassages {
        return {
            ...runner,
            race: excludeKeys(runner.race, ["isPublic", "order"]),
            passages: runner.passages.map(passage => pickKeys(passage, ["id", "time"])),
        };
    }
}
