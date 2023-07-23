import { Question, QuestionSet } from "nest-commander";

export interface CreateUserPasswordInquiry {
    password: string;
    confirmPassword: string;
}

export const CREATE_USER_PASSWORD_QUESTION_SET = "create-user-password-questions";

@QuestionSet({ name: CREATE_USER_PASSWORD_QUESTION_SET })
export class CreateUserPasswordQuestionSet {
    @Question({
        message: "Enter password:",
        name: "password",
        type: "password",
    })
    parsePassword(value: string): string {
        return value.trim();
    }

    @Question({
        message: "Confirm password:",
        name: "confirmPassword",
        type: "password",
    })
    parseConfirmPassword(value: string): string {
        return value.trim();
    }
}
