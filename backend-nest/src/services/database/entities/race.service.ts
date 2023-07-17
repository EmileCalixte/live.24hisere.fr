import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { excludeKeys } from "src/utils/misc.utils";
import { type AdminRaceWithRunnerCount, type PublicRaceWithRunnerCount, type RaceAndRunners } from "src/types/Race";
import { type Prisma, type Race } from "@prisma/client";

@Injectable()
export class RaceService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getAdminRaces(): Promise<AdminRaceWithRunnerCount[]> {
        const races = await this.getRacesWithRunners();

        return races
            .map(race => this.getAdminRaceFromRace(race))
            .map(race => this.getRaceWithRunnerCountFromRaceWithRunner(race));
    }

    async getAdminRace(where: Prisma.RaceWhereUniqueInput): Promise<AdminRaceWithRunnerCount | null> {
        const race = await this.getRaceWithRunners(where);

        console.log(race);

        if (!race) {
            return null;
        }

        return this.getAdminRaceFromRace(this.getRaceWithRunnerCountFromRaceWithRunner(race));
    }

    async getPublicRaces(): Promise<PublicRaceWithRunnerCount[]> {
        const races = await this.getRacesWithRunners({ isPublic: true });

        return races
            .map(race => this.getPublicRaceFromRace(race))
            .map(race => this.getRaceWithRunnerCountFromRaceWithRunner(race));
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

        return this.getPublicRaceFromRace(this.getRaceWithRunnerCountFromRaceWithRunner(race));
    }

    private async getRacesWithRunners(where: Prisma.RaceWhereInput = {}): Promise<RaceAndRunners[]> {
        return this.prisma.race.findMany({
            where,
            include: {
                runners: true,
            },
            orderBy: {
                order: "asc",
            },
        });
    }

    private async getRaceWithRunners(where: Prisma.RaceWhereUniqueInput): Promise<RaceAndRunners | null> {
        return this.prisma.race.findUnique({
            where,
            include: {
                runners: true,
            },
        });
    }

    private getAdminRaceFromRace<T extends Race>(race: T): Omit<T, "order"> {
        return excludeKeys(race, ["order"]);
    }

    private getPublicRaceFromRace<T extends Race>(race: T): Omit<T, "isPublic" | "order"> {
        return excludeKeys(race, ["isPublic", "order"]);
    }

    private getRaceWithRunnerCountFromRaceWithRunner<T extends { runners: R[] }, R>(race: T): Omit<T, "runners"> & { runnerCount: number } {
        return excludeKeys({
            ...race,
            runnerCount: race.runners.length,
        }, ["runners"]);
    }
}
