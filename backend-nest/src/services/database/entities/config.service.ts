import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {Config, Prisma} from "@prisma/client";

const KEY_IMPORT_DAG_FILE_PATH = "import_dag_file_path";

@Injectable()
export class ConfigService {
    constructor(private readonly prisma: PrismaService) {}

    public async getImportDagFilePath(): Promise<string | null> {
        const config = await this.getLine(KEY_IMPORT_DAG_FILE_PATH);

        return config?.value ?? null;
    }

    private async getLine(key: NonNullable<Prisma.ConfigWhereUniqueInput["key"]>): Promise<Config | null> {
        return this.prisma.config.findUnique({
            where: {key},
        });
    }

    private async saveLine(key: NonNullable<Prisma.ConfigWhereUniqueInput["key"]>, value: Config["value"]): Promise<Config> {
        return this.prisma.config.upsert({
            where: {
                key,
            },
            update: {
                value,
            },
            create: {
                key,
                value,
            },
        });
    }
}
