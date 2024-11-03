import { createParser } from "nuqs";
import { categoryUtils } from "@live24hisere/utils";

export const parseAsCategory = createParser({
  parse(value) {
    if (categoryUtils.isCategoryCode(value)) {
      return value;
    }

    return null;
  },

  serialize(categoryCode) {
    return categoryCode;
  },
});
