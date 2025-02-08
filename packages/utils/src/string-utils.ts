export function capitalizeWords(text: string, separators: string[] = [" "]): string {
  const separatorRegexPattern = separators.map((separator) => `\\${separator}`).join("|");
  const regex = new RegExp(`(?:^|[${separatorRegexPattern}])(\\S)`, "g");

  return text
    .toLowerCase()
    .replace(
      regex,
      (match, firstLetter: string) => `${match.slice(0, -firstLetter.length)}${firstLetter.toUpperCase()}`,
    );
}

export function harmonizeName(name: string): string {
  return capitalizeWords(name, [" ", "-"]).replace(/\s+/g, " ").trim();
}

export function isValidUrl(string: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(string);
  } catch {
    return false;
  }

  return true;
}

/**
 * Returns a new string with all diacritic and accents removed
 * @param text The text to transform
 * @param form The normalization form
 * @param lowerCase If true, the returned string will be transformed into lower case
 * @returns
 */
export function latinize(text: string, lowerCase = false, form = "NFKD"): string {
  const normalized = text.normalize(form).replace(/[\u0300-\u036f]/g, "");

  return lowerCase ? normalized.toLowerCase() : normalized;
}

/**
 * Checks if a substring is included within a string.
 * Both the string and the substring are normalized before performing the check.
 *
 * @param subject The string in which the substring will be searched
 * @param search The substring to be searched
 * @param caseSensitive If true, search will be case-sensitive
 * @returns True if normalized string includes normalized substring, false otherwise
 */
export function latinizedIncludes(subject: string, search: string, caseSensitive = false): boolean {
  return latinize(subject, !caseSensitive).includes(latinize(search, !caseSensitive));
}
