import { Injectable } from "@nestjs/common";
import { Prisma, Runner } from "@prisma/client";
import {
    AdminRunnerWithPassages,
    PublicRunnerWithPassages,
    PublicRunnerWithRaceAndPassages,
    RunnerWithRaceAndPassages,
} from "src/types/Runner";
import { objectUtils } from "@live24hisere/utils";
import { PrismaService } from "../prisma.service";

@Injectable()
export class RunnerService {
    constructor(private readonly prisma: PrismaService) {}

    async getRunners(where: Prisma.RunnerWhereInput = {}): Promise<Runner[]> {
        return await this.prisma.runner.findMany({
            where,
            orderBy: {
                id: "asc",
            },
        });
    }

    async getRunner(
        where: Prisma.RunnerWhereUniqueInput,
    ): Promise<Runner | null> {
        return await this.prisma.runner.findUnique({
            where,
        });
    }

    async getAdminRunner(
        where: Prisma.RunnerWhereUniqueInput,
    ): Promise<AdminRunnerWithPassages | null> {
        const runner = await this.prisma.runner.findUnique({
            where,
            include: {
                passages: true,
            },
        });

        if (!runner) {
            return null;
        }

        return {
            ...runner,
            passages: runner.passages.map((passage) =>
                objectUtils.excludeKeys(passage, ["runnerId"]),
            ),
        };
    }

    async getPublicRunners(): Promise<Runner[]> {
        return await this.prisma.runner.findMany({
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

    async getPublicRunnersOfRace(
        raceId: number,
    ): Promise<PublicRunnerWithPassages[]> {
        return await this.prisma.runner.findMany({
            where: {
                race: {
                    id: raceId,
                    isPublic: true,
                },
            },
            orderBy: {
                id: "asc",
            },
            include: {
                passages: {
                    select: {
                        id: true,
                        time: true,
                    },
                    where: {
                        isHidden: false,
                    },
                    orderBy: {
                        time: "asc",
                    },
                },
            },
        });
    }

    async getPublicRunner(
        where: Prisma.RunnerWhereUniqueInput,
    ): Promise<PublicRunnerWithRaceAndPassages | null> {
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

    async createRunner(data: Prisma.RunnerCreateInput): Promise<Runner> {
        return await this.prisma.runner.create({ data });
    }

    async createRunners(data: Prisma.RunnerCreateManyInput[]): Promise<number> {
        return (await this.prisma.runner.createMany({ data })).count;
    }

    async updateRunner(
        runner: Runner,
        data: Partial<Prisma.RunnerCreateInput & { id: number }>,
    ): Promise<Runner> {
        // If runner ID is not changed, we can directly update the runner
        if (!data.id || data.id === runner.id) {
            return await this.prisma.runner.update({
                where: { id: runner.id },
                data,
            });
        }

        // Else, we can't directly update the runner because we have to change runnerId of all runner's passages
        return await this.prisma.$transaction(async (tx) => {
            // So first we create a new runner
            const newRunner = await tx.runner.create({
                data: {
                    ...objectUtils.excludeKeys(runner, ["raceId"]),
                    ...data,
                    race: data.race ?? {
                        connect: {
                            id: runner.raceId,
                        },
                    },
                },
            });

            // Then we change passage runnerIds
            await tx.passage.updateMany({
                where: { runnerId: runner.id },
                data: { runnerId: newRunner.id },
            });

            // Finally we delete the old runner
            await tx.runner.delete({
                where: { id: runner.id },
            });

            return newRunner;
        });
    }

    async deleteRunner(where: Prisma.RunnerWhereUniqueInput): Promise<Runner> {
        return await this.prisma.$transaction(async (tx) => {
            await tx.passage.deleteMany({
                where: { runnerId: where.id },
            });

            return await tx.runner.delete({ where });
        });
    }

    private getPublicRunnerWithRaceAndPassages(
        runner: RunnerWithRaceAndPassages,
    ): PublicRunnerWithRaceAndPassages {
        return {
            ...runner,
            race: objectUtils.excludeKeys(runner.race, ["isPublic", "order"]),
            passages: runner.passages.map((passage) =>
                objectUtils.pickKeys(passage, ["id", "time"]),
            ),
        };
    }
}
