export function capitalizeWords(text: string, separators: string[] = [" "]): string {
    const separatorRegexPattern = separators.map(separator => `\\${separator}`).join("|");
    const regex = new RegExp(`(?:^|[${separatorRegexPattern}])(\\S)`, "g");

    return text.toLowerCase().replace(regex, (match, firstLetter) => `${match.slice(0, -firstLetter.length)}${firstLetter.toUpperCase()}`);
}

export function harmonizeName(name: string): string {
    return capitalizeWords(name, [" ", "-"]).replace(/\s+/g, " ").trim();
}
