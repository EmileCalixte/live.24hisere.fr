import {
    boolean,
    datetime,
    decimal,
    int,
    MySqlDatetimeConfig,
    mysqlTable,
    varchar,
} from "drizzle-orm/mysql-core";

const TABLE_NAME_ACCESS_TOKEN = "access_token";
const TABLE_NAME_CONFIG = "config";
const TABLE_NAME_MISC = "misc";
const TABLE_NAME_PASSAGE = "passage";
const TABLE_NAME_RACE = "race";
const TABLE_NAME_RUNNER = "runner";
const TABLE_NAME_USER = "user";

const DEFAULT_DATE_PARAMS: MySqlDatetimeConfig = {
    fsp: 0,
    mode: "string", // To get dates as string instead of Date objects
};

export const config = mysqlTable(TABLE_NAME_CONFIG, {
    key: varchar("key", { length: 255 }).primaryKey(),
    value: varchar("value", { length: 5000 }).notNull(),
});

export const misc = mysqlTable(TABLE_NAME_MISC, {
    key: varchar("key", { length: 255 }).primaryKey(),
    value: varchar("value", { length: 5000 }).notNull(),
});

export const race = mysqlTable(TABLE_NAME_RACE, {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    startTime: datetime("start_time", DEFAULT_DATE_PARAMS).notNull(),
    duration: int("duration", { unsigned: true }).notNull(),
    initialDistance: decimal("initial_distance", {
        precision: 10,
        scale: 3,
    }).notNull(),
    lapDistance: decimal("lap_distance", { precision: 10, scale: 3 }).notNull(),
    order: int("order").notNull(),
    isPublic: boolean("is_public").notNull(),
});

export const runner = mysqlTable(TABLE_NAME_RUNNER, {
    id: int("id").primaryKey(),
    firstname: varchar("firstname", { length: 255 }).notNull(),
    lastname: varchar("lastname", { length: 255 }).notNull(),
    gender: varchar("gender", { length: 1, enum: ["M", "F"] }).notNull(),
    birthYear: varchar("birth_year", { length: 4 }).notNull(),
    stopped: boolean("stopped").notNull(),
    raceId: int("race_id")
        .references(() => race.id)
        .notNull(),
});

export const passage = mysqlTable(TABLE_NAME_PASSAGE, {
    id: int("id").primaryKey().autoincrement(),
    detectionId: int("detection_id").unique(), // Not null if the passage comes from a detection of the timing system
    importTime: datetime("import_time", DEFAULT_DATE_PARAMS), // same
    runnerId: int("runner_id")
        .references(() => runner.id)
        .notNull(),
    time: datetime("time", DEFAULT_DATE_PARAMS).notNull(),
    isHidden: boolean("is_hidden").notNull(),
});

export const user = mysqlTable(TABLE_NAME_USER, {
    id: int("id").primaryKey().autoincrement(),
    username: varchar("username", { length: 32 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
});

export const accessToken = mysqlTable(TABLE_NAME_ACCESS_TOKEN, {
    token: varchar("token", { length: 32 }).primaryKey(),
    userId: int("user_id")
        .references(() => user.id)
        .notNull(),
    expirationDate: datetime("expiration_date", DEFAULT_DATE_PARAMS).notNull(),
});
