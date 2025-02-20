import type { PublicEdition } from "@live24hisere/core/types";
import type { SelectOption } from "../types/Forms";

/**
 * Returns an array of select options from an array of editions
 * @param editions
 * @param label an optional callback function to format the label
 */
export function getEditionsSelectOptions<TEdition extends PublicEdition>(
  editions: TEdition[] | undefined,
  label?: (race: TEdition) => string,
): SelectOption[] {
  if (!editions) {
    return [];
  }

  return editions.map((edition) => ({
    label: label ? label(edition) : edition.name,
    value: edition.id,
  }));
}
