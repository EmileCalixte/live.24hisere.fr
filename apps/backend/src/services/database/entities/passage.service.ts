import { Injectable } from "@nestjs/common";
import { type PrismaService } from "../prisma.service";
import { type Passage, type Prisma } from "@prisma/client";

@Injectable()
export class PassageService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getAllPassages(): Promise<Passage[]> {
        return await this.prisma.passage.findMany();
    }

    async getAllPublicPassages(): Promise<Passage[]> {
        return await this.prisma.passage.findMany({
            where: {
                isHidden: false,
            },
        });
    }

    async getPassage(passageWhereUniqueInput: Prisma.PassageWhereUniqueInput): Promise<Passage | null> {
        return await this.prisma.passage.findUnique({
            where: passageWhereUniqueInput,
        });
    }

    async createPassage(data: Prisma.PassageCreateInput): Promise<Passage> {
        return await this.prisma.passage.create({
            data,
        });
    }

    async updatePassage(id: Passage["id"], data: Omit<Prisma.PassageUpdateInput, "runner">): Promise<Passage> {
        return await this.prisma.passage.update({
            where: { id },
            data,
        });
    }

    async deletePassage(where: Prisma.PassageWhereUniqueInput): Promise<Passage> {
        return await this.prisma.passage.delete({ where });
    }
}
