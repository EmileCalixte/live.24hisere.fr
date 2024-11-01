import { Question, QuestionSet } from "nest-commander";

export interface CurrentPasswordInquiry {
  password: string;
}

export const CURRENT_PASSWORD_QUESTION_SET = "current-password-questions";

@QuestionSet({ name: CURRENT_PASSWORD_QUESTION_SET })
export class CurrentPasswordQuestionSet {
  @Question({
    message: "Current password:",
    name: "password",
    type: "password",
  })
  parsePassword(value: string): string {
    return value;
  }
}
