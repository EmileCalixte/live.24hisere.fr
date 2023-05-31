import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {excludeKeys} from "src/utils/misc.utils";
import {PublicRaceWithRunnerCount} from "src/types/Race";

@Injectable()
export class RacesService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getPublicRaces(): Promise<PublicRaceWithRunnerCount[]> {
        const races = await this.prisma.race.findMany({
            where: {
                isPublic: true,
            },
            include: {
                runners: true,
            },
            orderBy: {
                order: "asc",
            },
        });

        return races.map(race => excludeKeys(
            {
                ...race,
                runnerCount: race.runners.length,
            },
            ["isPublic", "order", "runners"],
        ));
    }
}
