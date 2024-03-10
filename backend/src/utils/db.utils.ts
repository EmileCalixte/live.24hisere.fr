export function booleanToString(value: boolean): string {
    return value ? "1" : "0";
}

export function stringToBoolean(value: string): boolean {
    return value !== ""
        && value !== "0";
}
