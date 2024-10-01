export function assignDefined<T extends object>(
    target: T,
    ...sources: Array<Partial<T>>
): T {
    const newTarget = { ...target };

    for (const source of sources) {
        for (const key of Object.keys(source)) {
            const value = source[key as keyof typeof source];

            if (value !== undefined) {
                newTarget[key as keyof typeof source] = value;
            }
        }
    }

    return newTarget;
}
