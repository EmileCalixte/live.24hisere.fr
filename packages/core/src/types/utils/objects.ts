export type UnionTypeRecord<T extends string> = {
  [K in T]: K;
};

/**
 * Returns the type of the value of the given key.
 *
 * If a value is optional, the returned type does not include undefined if:
 * - the value is optional but undefined is not included in the base value type
 * - the value is optional, undefined is included in the base value type and `exactOptionalPropertyTypes: false` in TS config
 *
 * ```ts
 * type Example = {
 *     requiredString: string;
 *     requiredValue: "value1" | "value2";
 *     optionalString?: string;
 *     optionalValue?: "value3" | "value4";
 *     stringOrUndefined: string | undefined;
 *     valueOrUndefined: "value5" | "value6" | undefined;
 *     optionalStringOrUndefined?: string | undefined;
 * };
 *
 * type Example1 = ObjectValueType<Example, "requiredString"> // string
 * type Example2 = ObjectValueType<Example, "requiredValue">; // "value1" | "value2"
 * type Example3 = ObjectValueType<Example, "optionalString">; // string
 * type Example4 = ObjectValueType<Example, "optionalValue">; // "value3" | "value4"
 * type Example5 = ObjectValueType<Example, "stringOrUndefined">; // string | undefined
 * type Example6 = ObjectValueType<Example, "valueOrUndefined">; // "value5" | "value6" | undefined
 * type Example7 = ObjectValueType<Example, "optionalStringOrUndefined">; // string | undefined (with exactOptionalPropertyTypes: true), string (with exactOptionalPropertyTypes: false)
 * ```
 */
export type ObjectValueType<TObject extends object, TKey extends keyof TObject> = Required<{
  [P in TKey]: TObject[TKey];
}>[TKey];

/**
 * Returns the type of the entries returned by Object.entries on an object of type TObject
 */
export type Entries<TObject extends object> = Array<
  Exclude<
    {
      [K in keyof TObject]: [K, ObjectValueType<TObject, K>];
    }[keyof TObject],
    undefined
  >
>;
