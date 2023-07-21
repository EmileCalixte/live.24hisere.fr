export type ConstantsRecord<T extends string> = {
    [K in T]: K;
};
