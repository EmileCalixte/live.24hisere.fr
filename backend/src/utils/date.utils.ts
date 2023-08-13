export function isDateValid(date: Date): boolean {
    return !isNaN(date.getTime());
}
