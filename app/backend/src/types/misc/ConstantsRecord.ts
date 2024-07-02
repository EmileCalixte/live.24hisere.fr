/**
 * A record of string literal type where keys and values are equal
 */
export type ConstantsRecord<T extends string> = {
    [K in T]: K;
};
