import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { excludeKeys } from "src/utils/misc.utils";
import {
    AdminRaceWithRunnerCount,
    PublicRaceWithRunnerCount,
    RaceAndRunners,
} from "src/types/Race";
import { Prisma, Race } from "@prisma/client";

@Injectable()
export class RaceService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getRace(where: Prisma.RaceWhereUniqueInput): Promise<Race | null> {
        return await this.prisma.race.findUnique({ where });
    }

    async getAdminRaces(): Promise<AdminRaceWithRunnerCount[]> {
        const races = await this.getRacesWithRunners();

        return races
            .map(race => this.getAdminRaceFromRace(race))
            .map(race => this.getRaceWithRunnerCountFromRaceWithRunners(race));
    }

    async getAdminRace(where: Prisma.RaceWhereUniqueInput): Promise<AdminRaceWithRunnerCount | null> {
        const race = await this.getRaceWithRunners(where);

        if (!race) {
            return null;
        }

        return this.getAdminRaceFromRace(this.getRaceWithRunnerCountFromRaceWithRunners(race));
    }

    async getPublicRaces(): Promise<PublicRaceWithRunnerCount[]> {
        const races = await this.getRacesWithRunners({ isPublic: true });

        return races
            .map(race => this.getPublicRaceFromRace(race))
            .map(race => this.getRaceWithRunnerCountFromRaceWithRunners(race));
    }

    async getPublicRace(where: Prisma.RaceWhereUniqueInput): Promise<PublicRaceWithRunnerCount | null> {
        const race = await this.getRaceWithRunners({ ...where, isPublic: true });

        if (!race) {
            return null;
        }

        return this.getPublicRaceFromRace(this.getRaceWithRunnerCountFromRaceWithRunners(race));
    }

    async getMaxOrder(): Promise<number> {
        const result = await this.prisma.race.aggregate({
            _max: {
                order: true,
            },
        });

        return result._max.order ?? 0;
    }

    async createRace(data: Prisma.RaceCreateInput): Promise<Race> {
        return await this.prisma.race.create({ data });
    }

    async updateRace(id: Race["id"], data: Prisma.RaceUpdateInput): Promise<AdminRaceWithRunnerCount> {
        const updatedRace = await this.prisma.race.update({
            where: { id },
            data,
            include: {
                runners: true,
            },
        });

        return this.getAdminRaceFromRace(this.getRaceWithRunnerCountFromRaceWithRunners(updatedRace));
    }

    async deleteRace(where: Prisma.RaceWhereUniqueInput): Promise<Race> {
        return await this.prisma.race.delete({ where });
    }

    private async getRacesWithRunners(where: Prisma.RaceWhereInput = {}): Promise<RaceAndRunners[]> {
        return await this.prisma.race.findMany({
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
        return await this.prisma.race.findUnique({
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

    private getRaceWithRunnerCountFromRaceWithRunners<T extends { runners: R[] }, R>(race: T): Omit<T, "runners"> & { runnerCount: number } {
        return excludeKeys({
            ...race,
            runnerCount: race.runners.length,
        }, ["runners"]);
    }
}
