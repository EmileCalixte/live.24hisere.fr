import { createParser, type ParserBuilder } from "nuqs";
import { arrayUtils } from "@live24hisere/utils";

export function parseAsEnum<T extends readonly string[]>(availableValues: T): ParserBuilder<T[number]> {
  return createParser({
    parse(value) {
      if (arrayUtils.inArray(value, availableValues)) {
        return value;
      }

      return null;
    },

    serialize(value) {
      return value;
    },
  });
}
