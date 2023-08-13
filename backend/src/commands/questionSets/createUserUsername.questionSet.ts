import { Question, QuestionSet } from "nest-commander";

export interface CreateUserUsernameInquiry {
    username: string;
}

export const CREATE_USER_USERNAME_QUESTION_SET = "create-user-username-questions";

@QuestionSet({ name: CREATE_USER_USERNAME_QUESTION_SET })
export class CreateUserUsernameQuestionSet {
    @Question({
        message: "Enter username:",
        name: "username",
    })
    parseUsername(value: string): string {
        return value.trim();
    }
}
