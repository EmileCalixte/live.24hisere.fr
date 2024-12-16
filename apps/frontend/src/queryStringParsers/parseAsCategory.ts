import { isCategoryCode } from "@emilecalixte/ffa-categories";
import { createParser } from "nuqs";

export const parseAsCategory = createParser({
  parse(value) {
    if (isCategoryCode(value)) {
      return value;
    }

    return null;
  },

  serialize(categoryCode) {
    return categoryCode;
  },
});
