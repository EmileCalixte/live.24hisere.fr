import { Type } from "@nestjs/common/interfaces/type.interface";
import { CreateUserCommand } from "./commands/createUser.command";
import { MigrateCommand } from "./commands/db/migrate.command";
import { CreatePasswordQuestionSet } from "./commands/questionSets/createPassword.questionSet";
import { CurrentPasswordQuestionSet } from "./commands/questionSets/currentPassword.questionSet";
import { UsernameQuestionSet } from "./commands/questionSets/username.questionSet";
import { UpdateUserPasswordCommand } from "./commands/updateUserPassword.command";
import { ConfigController } from "./controllers/admin/config.controller";
import { EditionsController as EditionsControllerAdmin } from "./controllers/admin/editions.controller";
import { PassagesController } from "./controllers/admin/passages.controller";
import { RacesController as RacesControllerAdmin } from "./controllers/admin/races.controller";
import { RunnerPassagesController } from "./controllers/admin/runnerPassages.controller";
import { RunnersController as RunnersControllerAdmin } from "./controllers/admin/runners.controller";
import { UsersController } from "./controllers/admin/users.controller";
import { AppDataController } from "./controllers/appData.controller";
import { AuthController } from "./controllers/auth.controller";
import { EditionsController } from "./controllers/editions.controller";
import { RacesController } from "./controllers/races.controller";
import { RunnersController } from "./controllers/runners.controller";
import { AuthService } from "./services/auth.service";
import { DagFileService } from "./services/dagFile.service";
import { DrizzleService } from "./services/database/drizzle.service";
import { AccessTokenService } from "./services/database/entities/accessToken.service";
import { ConfigService } from "./services/database/entities/config.service";
import { EditionService } from "./services/database/entities/edition.service";
import { MiscService } from "./services/database/entities/misc.service";
import { PassageService } from "./services/database/entities/passage.service";
import { RaceService } from "./services/database/entities/race.service";
import { RunnerService } from "./services/database/entities/runner.service";
import { UserService } from "./services/database/entities/user.service";
import { EnvService } from "./services/env.service";
import { PasswordService } from "./services/password.service";
import { RandomService } from "./services/random.service";
import { ImportPassagesService } from "./tasks/importPassages.service";
import { EditionIdExistsRule } from "./validation/rules/edition/editionIdExists.rule";
import { RaceIdExistsRule } from "./validation/rules/race/raceIdExists.rule";

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
    public: [AppDataController, AuthController, EditionsController, RacesController, RunnersController],
    admin: [
      ConfigController,
      EditionsControllerAdmin,
      PassagesController,
      RacesControllerAdmin,
      RunnerPassagesController,
      RunnersControllerAdmin,
      UsersController,
    ],
  },
  services: {
    app: [AuthService, DagFileService, EnvService, PasswordService, RandomService],
    database: [
      DrizzleService,
      AccessTokenService,
      ConfigService,
      EditionService,
      MiscService,
      PassageService,
      RaceService,
      RunnerService,
      UserService,
    ],
  },
  tasks: [ImportPassagesService],
  validationRules: [EditionIdExistsRule, RaceIdExistsRule],
  commands: [CreateUserCommand, UpdateUserPasswordCommand, MigrateCommand],
  questionSets: [CreatePasswordQuestionSet, CurrentPasswordQuestionSet, UsernameQuestionSet],
};
