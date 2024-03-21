import { Injectable } from "@nestjs/common";
import { type User } from "@prisma/client";
import { Command, CommandRunner, InquirerService } from "nest-commander";
import { UserService } from "../services/database/entities/user.service";
import { PasswordService } from "../services/password.service";
import { CREATE_PASSWORD_QUESTION_SET, type CreatePasswordInquiry } from "./questionSets/createPassword.questionSet";
import { CURRENT_PASSWORD_QUESTION_SET, type CurrentPasswordInquiry } from "./questionSets/currentPassword.questionSet";
import { USERNAME_QUESTION_SET, type UsernameInquiry } from "./questionSets/username.questionSet";

@Injectable()
@Command({
    name: "update-user-password",
    description: "Update user password",
})
export class UpdateUserPasswordCommand extends CommandRunner {
    constructor(
        private readonly inquirerService: InquirerService,
        private readonly passwordService: PasswordService,
        private readonly userService: UserService,
    ) {
        super();
    }

    async run(): Promise<void> {
        const user = await this.askUser();
        console.log("toto");
        await this.askCurrentPassword(user);
        const newPassword = await this.askPassword();

        const passwordHash = await this.passwordService.hashPassword(newPassword);

        await this.userService.editUser(user, { passwordHash });

        console.log("Password updated successfully");
    }

    private async askUser(): Promise<User> {
        while (true) {
            const { username } = await this.inquirerService.ask<UsernameInquiry>(
                USERNAME_QUESTION_SET,
                undefined,
            );

            const user = await this.userService.getUser({ username });

            if (!user) {
                console.log("User not found");
                continue;
            }

            return user;
        }
    }

    private async askCurrentPassword(user: User): Promise<void> {
        while (true) {
            const { password } = await this.inquirerService.ask<CurrentPasswordInquiry>(
                CURRENT_PASSWORD_QUESTION_SET,
                undefined,
            );

            if (!(await this.passwordService.verifyPassword(user.passwordHash, password))) {
                console.log("Invalid password");
                continue;
            }

            return;
        }
    }

    private async askPassword(): Promise<string> {
        while (true) {
            const { password, confirmPassword } = await this.inquirerService.ask<CreatePasswordInquiry>(
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
