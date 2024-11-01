import { Question, QuestionSet } from "nest-commander";

export interface CreatePasswordInquiry {
  password: string;
  confirmPassword: string;
}

export const CREATE_PASSWORD_QUESTION_SET = "create-password-questions";

@QuestionSet({ name: CREATE_PASSWORD_QUESTION_SET })
export class CreatePasswordQuestionSet {
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
