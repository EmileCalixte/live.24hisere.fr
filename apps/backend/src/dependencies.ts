import { Type } from "@nestjs/common/interfaces/type.interface";
import { CreateUserCommand } from "./commands/createUser.command";
import { AnonymizeRunnersCommand } from "./commands/db/anonymizeRunners.command";
import { MigrateCommand } from "./commands/db/migrate.command";
import { ImportPassagesCsvCommand } from "./commands/passages/importPassagesCsv";
import { CreatePasswordQuestionSet } from "./commands/questionSets/createPassword.questionSet";
import { CurrentPasswordQuestionSet } from "./commands/questionSets/currentPassword.questionSet";
import { UsernameQuestionSet } from "./commands/questionSets/username.questionSet";
import { UpdateUserPasswordCommand } from "./commands/updateUserPassword.command";
import { ConfigController } from "./controllers/admin/config.controller";
import { CustomRunnerCategoriesController } from "./controllers/admin/customRunnerCategories.controller";
import { EditionsController as EditionsControllerAdmin } from "./controllers/admin/editions.controller";
import { ParticipantsController as ParticipantsControllerAdmin } from "./controllers/admin/participants.controller";
import { PassageImportRulesController } from "./controllers/admin/passageImportRules.controller";
import { PassagesController } from "./controllers/admin/passages.controller";
import { RacesController as RacesControllerAdmin } from "./controllers/admin/races.controller";
import { RunnersController as RunnersControllerAdmin } from "./controllers/admin/runners.controller";
import { UsersController } from "./controllers/admin/users.controller";
import { AppDataController } from "./controllers/appData.controller";
import { AuthController } from "./controllers/auth.controller";
import { EditionsController } from "./controllers/editions.controller";
import { ParticipantsController } from "./controllers/participants.controller";
import { RacesController } from "./controllers/races.controller";
import { RunnersController } from "./controllers/runners.controller";
import { AuthService } from "./services/auth.service";
import { DagFileService } from "./services/dagFile.service";
import { DrizzleService } from "./services/database/drizzle.service";
import { AccessTokenService } from "./services/database/entities/accessToken.service";
import { ConfigService } from "./services/database/entities/config.service";
import { CustomRunnerCategoryService } from "./services/database/entities/customRunnerCategory.service";
import { EditionService } from "./services/database/entities/edition.service";
import { MiscService } from "./services/database/entities/misc.service";
import { ParticipantService } from "./services/database/entities/participant.service";
import { PassageService } from "./services/database/entities/passage.service";
import { PassageImportRuleService } from "./services/database/entities/passageImportRule.service";
import { RaceService } from "./services/database/entities/race.service";
import { RunnerService } from "./services/database/entities/runner.service";
import { UserService } from "./services/database/entities/user.service";
import { EnvService } from "./services/env.service";
import { PasswordService } from "./services/password.service";
import { RandomService } from "./services/random.service";
import { ImportPassagesService } from "./tasks/importPassages.service";
import { CustomRunnerCategoryIdExistsRule } from "./validation/rules/customRunnerCategory/customRunnerCategoryIdExists.rule";
import { EditionIdExistsRule } from "./validation/rules/edition/editionIdExists.rule";
import { RaceIdExistsRule } from "./validation/rules/race/raceIdExists.rule";
import { RunnerIdExistsRule } from "./validation/rules/runner/runnerIdExists.rule";

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
      EditionsController,
      ParticipantsController,
      RacesController,
      RunnersController,
    ],
    admin: [
      ConfigController,
      CustomRunnerCategoriesController,
      EditionsControllerAdmin,
      ParticipantsControllerAdmin,
      PassagesController,
      PassageImportRulesController,
      RacesControllerAdmin,
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
      CustomRunnerCategoryService,
      EditionService,
      MiscService,
      ParticipantService,
      PassageImportRuleService,
      PassageService,
      RaceService,
      RunnerService,
      UserService,
    ],
  },
  tasks: [ImportPassagesService],
  validationRules: [CustomRunnerCategoryIdExistsRule, EditionIdExistsRule, RaceIdExistsRule, RunnerIdExistsRule],
  commands: [
    AnonymizeRunnersCommand,
    CreateUserCommand,
    ImportPassagesCsvCommand,
    UpdateUserPasswordCommand,
    MigrateCommand,
  ],
  questionSets: [CreatePasswordQuestionSet, CurrentPasswordQuestionSet, UsernameQuestionSet],
};
