import { CreateUserCommand } from "./commands/createUser.command";
import { CreateUserPasswordQuestionSet } from "./commands/questionSets/createUserPassword.questionSet";
import { CreateUserUsernameQuestionSet } from "./commands/questionSets/createUserUsername.questionSet";
import { PassagesController } from "./controllers/admin/passages.controller";
import { RacesController as RacesControllerAdmin } from "./controllers/admin/races.controller";
import { RunnerPassagesController } from "./controllers/admin/runnerPassages.controller";
import { RunnersController as RunnersControllerAdmin } from "./controllers/admin/runners.controller";
import { UsersController } from "./controllers/admin/users.controller";
import { AppDataController } from "./controllers/appData.controller";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { DagFileService } from "./services/dagFile.service";
import { AccessTokenService } from "./services/database/entities/accessToken.service";
import { ConfigService } from "./services/database/entities/config.service";
import { MiscService } from "./services/database/entities/misc.service";
import { PassageService } from "./services/database/entities/passage.service";
import { RaceService } from "./services/database/entities/race.service";
import { RunnerService } from "./services/database/entities/runner.service";
import { UserService } from "./services/database/entities/user.service";
import { PrismaService } from "./services/database/prisma.service";
import { PasswordService } from "./services/password.service";
import { RandomService } from "./services/random.service";
import { ImportPassagesService } from "./tasks/importPassages.service";
import { RaceIdExistsRule } from "./validation/rules/race/raceIdExists.rule";
import { type Type } from "@nestjs/common/interfaces/type.interface";

type DependencyArray = Type[];

export interface Dependencies {
    controllers: {
        public: DependencyArray;
        admin: DependencyArray;
    };
    services: {
        app: DependencyArray;
        database: DependencyArray;
    };
    tasks: DependencyArray;
    validationRules: DependencyArray;
    commands: DependencyArray;
    questionSets: DependencyArray;
}

export const dependencies: Dependencies = {
    controllers: {
        public: [
            AppDataController,
            AuthController,
        ],
        admin: [
            PassagesController,
            RacesControllerAdmin,
            RunnerPassagesController,
            RunnersControllerAdmin,
            UsersController,
        ],
    },
    services: {
        app: [
            AuthService,
            DagFileService,
            PasswordService,
            RandomService,
        ],
        database: [
            PrismaService,
            AccessTokenService,
            ConfigService,
            MiscService,
            PassageService,
            RaceService,
            RunnerService,
            UserService,
        ],
    },
    tasks: [
        ImportPassagesService,
    ],
    validationRules: [
        RaceIdExistsRule,
    ],
    commands: [
        CreateUserCommand,
    ],
    questionSets: [
        CreateUserPasswordQuestionSet,
        CreateUserUsernameQuestionSet,
    ],
};
