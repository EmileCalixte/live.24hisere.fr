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
 * Checks if a substring is included within a string.
 * Both the string and the substring are normalized before performing the check.
 *
 * @param subject The string in which the substring will be searched
 * @param search The substring to be searched
 * @param caseSensitive If true, search will be case-sensitive
 * @returns True if normalized string includes normalized substring, false otherwise
 */
export function normalizedIncludes(subject: string, search: string, caseSensitive = false): boolean {
  let string = subject;
  let subString = search;

  if (!caseSensitive) {
    string = string.toLowerCase();
    subString = subString.toLowerCase();
  }

  return string.normalize().includes(subString.normalize());
}
