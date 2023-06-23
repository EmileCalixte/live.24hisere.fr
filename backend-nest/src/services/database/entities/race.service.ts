import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { excludeKeys } from "src/utils/misc.utils";
import { type PublicRaceWithRunnerCount, type RaceAndRunners } from "src/types/Race";
import { type Prisma } from "@prisma/client";

@Injectable()
export class RaceService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getPublicRaces(): Promise<PublicRaceWithRunnerCount[]> {
        const races: RaceAndRunners[] = await this.prisma.race.findMany({
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

        return this.getPublicRacesWithRunnerCountFromRacesWithRunners(races);
    }

    async getPublicRace(raceWhereUniqueInput: Prisma.RaceWhereUniqueInput): Promise<PublicRaceWithRunnerCount | null> {
        const race = await this.prisma.race.findUnique({
            where: raceWhereUniqueInput,
            include: {
                runners: true,
            },
        });

        if (race === null) {
            return null;
        }

        if (!race.isPublic) {
            return null;
        }

        return this.getPublicRaceWithRunnerCountFromRaceWithRunner(race);
    }

    private getPublicRacesWithRunnerCountFromRacesWithRunners(races: RaceAndRunners[]): PublicRaceWithRunnerCount[] {
        return races.map(race => this.getPublicRaceWithRunnerCountFromRaceWithRunner(race));
    }

    private getPublicRaceWithRunnerCountFromRaceWithRunner(race: RaceAndRunners): PublicRaceWithRunnerCount {
        return excludeKeys({
            ...race,
            runnerCount: race.runners.length,
        }, ["isPublic", "order", "runners"]);
    }
}
