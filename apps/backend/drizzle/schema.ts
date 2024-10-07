import { mysqlTable } from "drizzle-orm/mysql-core";

const TABLE_NAME_ACCESS_TOKEN = "access_token";
const TABLE_NAME_CONFIG = "config";
const TABLE_NAME_MISC = "misc";
const TABLE_NAME_PASSAGE = "passage";
const TABLE_NAME_RACE = "race";
const TABLE_NAME_RUNNER = "runner";
const TABLE_NAME_USER = "user";

const DEFAULT_DATE_PARAMS = {
    fsp: 0,
    mode: "string", // To get dates as string instead of Date objects
} as const;

export const TABLE_CONFIG = mysqlTable(TABLE_NAME_CONFIG, (t) => ({
    key: t.varchar({ length: 255 }).primaryKey(),
    value: t.varchar({ length: 5000 }).notNull(),
}));

export const TABLE_MISC = mysqlTable(TABLE_NAME_MISC, (t) => ({
    key: t.varchar({ length: 255 }).primaryKey(),
    value: t.varchar({ length: 5000 }).notNull(),
}));

export const TABLE_RACE = mysqlTable(TABLE_NAME_RACE, (t) => ({
    id: t.int().primaryKey().autoincrement(),
    name: t.varchar({ length: 50 }).notNull().unique(),
    startTime: t.datetime(DEFAULT_DATE_PARAMS).notNull(),
    duration: t.int({ unsigned: true }).notNull(),
    initialDistance: t.decimal({ precision: 10, scale: 3 }).notNull(),
    lapDistance: t.decimal({ precision: 10, scale: 3 }).notNull(),
    order: t.int().notNull(),
    isPublic: t.boolean().notNull(),
}));

export const TABLE_RUNNER = mysqlTable(TABLE_NAME_RUNNER, (t) => ({
    id: t.int().primaryKey(),
    firstname: t.varchar({ length: 255 }).notNull(),
    lastname: t.varchar({ length: 255 }).notNull(),
    gender: t.varchar({ length: 1, enum: ["M", "F"] }).notNull(),
    birthYear: t.varchar({ length: 4 }).notNull(),
    stopped: t.boolean().notNull(),
    raceId: t
        .int()
        .references(() => TABLE_RACE.id)
        .notNull(),
}));

export const TABLE_PASSAGE = mysqlTable(TABLE_NAME_PASSAGE, (t) => ({
    id: t.int().primaryKey().autoincrement(),
    detectionId: t.int().unique(), // Not null if the passage comes from a detection of the timing system
    importTime: t.datetime(DEFAULT_DATE_PARAMS), // same
    runnerId: t
        .int()
        .references(() => TABLE_RUNNER.id)
        .notNull(),
    time: t.datetime(DEFAULT_DATE_PARAMS).notNull(),
    isHidden: t.boolean().notNull(),
}));

export const TABLE_USER = mysqlTable(TABLE_NAME_USER, (t) => ({
    id: t.int().primaryKey().autoincrement(),
    username: t.varchar({ length: 32 }).unique().notNull(),
    passwordHash: t.varchar({ length: 255 }).notNull(),
}));

export const TABLE_ACCESS_TOKEN = mysqlTable(TABLE_NAME_ACCESS_TOKEN, (t) => ({
    token: t.varchar({ length: 32 }).primaryKey(),
    userId: t
        .int()
        .references(() => TABLE_USER.id)
        .notNull(),
    expirationDate: t.datetime(DEFAULT_DATE_PARAMS).notNull(),
}));