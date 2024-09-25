import { Prisma } from "@prisma/client";

type ConvertPrismaTypeToType<T> = ConvertPrismaDecimalToString<T>;

export function convertPrismaTypeToType<TObject extends object>(
    object: TObject,
): ConvertPrismaTypeToType<TObject> {
    return convertPrismaDecimalToString(object);
}

type ConvertPrismaDecimalToString<T> = {
    [K in keyof T]: T[K] extends Prisma.Decimal
        ? string
        : T[K] extends object
          ? T[K] extends Date
              ? T[K]
              : T[K] extends Array<infer U>
                ? Array<ConvertPrismaDecimalToString<U>>
                : // eslint-disable-next-line @typescript-eslint/ban-types
                  T[K] extends Function
                  ? T[K]
                  : ConvertPrismaDecimalToString<T[K]>
          : T[K];
};

function convertPrismaDecimalToString<TObject extends object>(
    object: TObject,
): ConvertPrismaDecimalToString<TObject> {
    const convertedObject = { ...object };

    for (const key in object) {
        const value = object[key];
        if (value instanceof Prisma.Decimal) {
            convertedObject[key] = value.toString();
        } else if (
            value &&
            typeof value === "object" &&
            value.constructor.name === "Object"
        ) {
            convertedObject[key] = convertPrismaDecimalToString(value);
        } else {
            convertedObject[key] = value;
        }
    }

    return convertedObject;
}
