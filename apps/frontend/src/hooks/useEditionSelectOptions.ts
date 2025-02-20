import React from "react";
import type { PublicEdition } from "@live24hisere/core/types";
import type { SelectOption } from "../types/Forms";
import { getEditionsSelectOptions } from "../utils/editionUtils";

export function useEditionSelectOptions<TEdition extends PublicEdition>(
  editions: TEdition[] | undefined,
  label?: (edition: TEdition) => string,
): SelectOption[] {
  return React.useMemo(() => getEditionsSelectOptions(editions, label), [editions, label]);
}
