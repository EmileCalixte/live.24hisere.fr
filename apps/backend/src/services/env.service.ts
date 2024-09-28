import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NODE_ENV_PRODUCTION } from "src/constants/env.constants";

const REQUIRED_ENVIRONMENT_VARIABLES = [
    "TZ",
    "FRONTEND_URL",
    "DATABASE_URL",
    "SHADOW_DATABASE_URL",
] as const;

/**
 * Environment variables that may not be defined. Key: variable name, value: default value if environment variable is not defined
 */
const OPTIONAL_ENVIRONMENT_VARIABLES = {
    NODE_ENV: NODE_ENV_PRODUCTION,
    IMPORT_PASSAGES_TASK_CRON: undefined,
};

type RequiredEnvironmentVariables = Record<
    (typeof REQUIRED_ENVIRONMENT_VARIABLES)[number],
    string
>;

type OptionalEnvironmentVariables = {
    [K in keyof typeof OPTIONAL_ENVIRONMENT_VARIABLES]:
        | string
        | (typeof OPTIONAL_ENVIRONMENT_VARIABLES)[K];
};

type EnvironmentVariables = RequiredEnvironmentVariables &
    OptionalEnvironmentVariables;

@Injectable()
export class EnvService implements OnModuleInit {
    private readonly logger = new Logger("EnvService");

    private environmentVariables: EnvironmentVariables;

    onModuleInit(): void {
        this.logger.log("Registering environment variables...");
        try {
            this.initEnv();
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
        this.logger.log("Environment variables registered");
    }

    get<TName extends keyof EnvironmentVariables>(
        variableName: TName,
    ): EnvironmentVariables[TName] {
        return this.environmentVariables[variableName];
    }

    private initEnv(): void {
        this.environmentVariables = {
            ...REQUIRED_ENVIRONMENT_VARIABLES.reduce<RequiredEnvironmentVariables>(
                (acc, variableName) => {
                    acc[variableName] = this.initRequiredValue(variableName);
                    return acc;
                },
                // An ugly `as` but with this reduce I don't know how to do this better
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                {} as RequiredEnvironmentVariables,
            ),
            ...Object.entries(
                OPTIONAL_ENVIRONMENT_VARIABLES,
            ).reduce<OptionalEnvironmentVariables>(
                (acc, [variableName, defaultValue]) => {
                    // @ts-ignore Object.entries does not infer key and value types
                    acc[variableName] = this.initOptionalValue(
                        variableName,
                        defaultValue,
                    );
                    return acc;
                },
                // An ugly `as` but with this reduce I don't know how to do this better
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                {} as OptionalEnvironmentVariables,
            ),
        };
    }

    private initRequiredValue(variableName: string): string {
        const value = process.env[variableName];

        if (value === undefined) {
            throw new Error(
                `Environment variable ${variableName} must be defined`,
            );
        }

        return value;
    }

    private initOptionalValue<TDefault extends string | undefined>(
        variableName: string,
        defaultValue: TDefault,
    ): string | TDefault {
        const value = process.env[variableName];

        if (value === undefined) {
            return defaultValue;
        }

        return value;
    }
}
