import { PassageService } from "./../../services/database/entities/passage.service";
import { Injectable } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";
import { RaceService } from "../../services/database/entities/race.service";

@Injectable()
@Command({
    name: "import-wiclax-passages",
    arguments: '[titi]',
    description: "Command created to import a passage list exported from wiclax for the 7th edition",
})
export class ImportWiclaxPassagesCommand extends CommandRunner {
    constructor(
        private readonly passageService: PassageService,
        private readonly raceService: RaceService,
    ) {
        super();
    }

    async run(params: string[], options?: Record<string, unknown>): Promise<void> {
        console.log(params, options);

        return await Promise.resolve(undefined);
    }

    @Option({
        flags: "-t, --toto [test]",
        description: "This is a test option",
    })
    parseToto(value: string): string[] {
        return value.split(',');
    }
}
