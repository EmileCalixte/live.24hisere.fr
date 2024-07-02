import { Question, QuestionSet } from "nest-commander";

export interface UsernameInquiry {
    username: string;
}

export const USERNAME_QUESTION_SET = "username-questions";

@QuestionSet({ name: USERNAME_QUESTION_SET })
export class UsernameQuestionSet {
    @Question({
        message: "Enter username:",
        name: "username",
    })
    parseUsername(value: string): string {
        return value.trim();
    }
}
