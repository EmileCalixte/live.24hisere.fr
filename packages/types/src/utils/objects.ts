export type UnionTypeRecord<T extends string> = {
    [K in T]: K;
};
