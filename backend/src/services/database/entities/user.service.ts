import { Injectable } from "@nestjs/common";
import { type User, type Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async getUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async editUser(user: User, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id: user.id },
            data,
        });
    }
}
