import { Injectable } from "@nestjs/common";
import { Command, CommandRunner, InquirerService } from "nest-commander";
import { UserService } from "../services/database/entities/user.service";
import { PasswordService } from "../services/password.service";
import {
    CREATE_PASSWORD_QUESTION_SET,
    CreatePasswordInquiry,
} from "./questionSets/createPassword.questionSet";
import {
    USERNAME_QUESTION_SET,
    UsernameInquiry,
} from "./questionSets/username.questionSet";

@Injectable()
@Command({
    name: "create-user",
    description: "Create a new user",
})
export class CreateUserCommand extends CommandRunner {
    constructor(
        private readonly inquirerService: InquirerService,
        private readonly passwordService: PasswordService,
        private readonly userService: UserService,
    ) {
        super();
    }

    async run(): Promise<void> {
        const username = await this.askUsername();
        const password = await this.askPassword();

        const passwordHash = await this.passwordService.hashPassword(password);

        await this.userService.createUser({
            username,
            passwordHash,
        });

        console.log("User created successfully");
    }

    private async askUsername(): Promise<string> {
        while (true) {
            const { username } =
                await this.inquirerService.ask<UsernameInquiry>(
                    USERNAME_QUESTION_SET,
                    undefined,
                );

            const existingUser = await this.userService.getUser({ username });

            if (existingUser) {
                console.log("A user with this name already exists");
                continue;
            }

            return username;
        }
    }

    private async askPassword(): Promise<string> {
        while (true) {
            const { password, confirmPassword } =
                await this.inquirerService.ask<CreatePasswordInquiry>(
                    CREATE_PASSWORD_QUESTION_SET,
                    undefined,
                );

            if (password !== confirmPassword) {
                console.log("Passwords do not match");
                continue;
            }

            return password;
        }
    }
}
