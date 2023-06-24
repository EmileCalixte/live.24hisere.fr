import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { type Passage, type Prisma } from ".prisma/client";

@Injectable()
export class PassageService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getAllPublicPassages(): Promise<Passage[]> {
        return this.prisma.passage.findMany({
            where: {
                isHidden: false,
            },
        });
    }

    async getPassage(passageWhereUniqueInput: Prisma.PassageWhereUniqueInput): Promise<Passage | null> {
        return this.prisma.passage.findUnique({
            where: passageWhereUniqueInput,
        });
    }

    async savePassage(data: Prisma.PassageCreateInput): Promise<Passage> {
        return this.prisma.passage.create({
            data,
        });
    }
}
