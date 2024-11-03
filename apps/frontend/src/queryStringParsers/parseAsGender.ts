import { createParser } from "nuqs";
import { genderUtils } from "@live24hisere/utils";

export const parseAsGender = createParser({
  parse(value) {
    if (genderUtils.isValidGender(value)) {
      return value;
    }

    return null;
  },

  serialize(gender) {
    return gender;
  },
});
