import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {Passage, Prisma} from ".prisma/client";

@Injectable()
export class PassageService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

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
