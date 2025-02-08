import { customType, mysqlTable, unique } from "drizzle-orm/mysql-core";
import { ALPHA3_COUNTRY_CODES, GENDERS } from "@live24hisere/core/constants";
import { dateUtils } from "@live24hisere/utils";

const TABLE_NAME_ACCESS_TOKEN = "access_token";
const TABLE_NAME_CONFIG = "config";
const TABLE_NAME_EDITION = "edition";
const TABLE_NAME_MISC = "misc";
const TABLE_NAME_PARTICIPANT = "participant";
const TABLE_NAME_PASSAGE = "passage";
const TABLE_NAME_RACE = "race";
const TABLE_NAME_RUNNER = "runner";
const TABLE_NAME_USER = "user";

const DEFAULT_DATE_PARAMS = {
  fsp: 0,
} as const;

/**
 * A custom date type that handles dates in ISO 8601 format instead of default YYYY-MM-DD hh:mm:ss
 */
const date = customType<{
  data: string;
  driverData: string;
  config: { fsp: number };
}>({
  dataType(config) {
    const precision = config?.fsp !== undefined ? `(${config.fsp})` : "";
    return `datetime${precision}`;
  },
  toDriver(value) {
    const date = new Date(value);

    if (!dateUtils.isDateValid(date)) {
      throw new Error(`${value} is not a valid date string`);
    }

    return dateUtils.formatDateForSql(date);
  },
  fromDriver(value) {
    // Map YYYY-MM-DD hh:mm:ss to ISO 8601 format (e.g.: 2024-04-06 09:00:03 => 2024-04-06T09:00:03.000Z)
    return new Date(value).toISOString();
  },
});

/**
 * A custom country code which is a VARCHAR(3) type but we ensure that the value is a valid country code
 */
const countryCode = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return "varchar(3)";
  },
  toDriver(value) {
    if (!ALPHA3_COUNTRY_CODES.includes(value)) {
      throw new Error(`${value} is not a valid ISO 3166-1 Alpha-3 country code`);
    }

    return value;
  },
});

export const TABLE_CONFIG = mysqlTable(TABLE_NAME_CONFIG, (t) => ({
  key: t.varchar({ length: 255 }).primaryKey(),
  value: t.varchar({ length: 5000 }).notNull(),
}));

export const TABLE_MISC = mysqlTable(TABLE_NAME_MISC, (t) => ({
  key: t.varchar({ length: 255 }).primaryKey(),
  value: t.varchar({ length: 5000 }).notNull(),
}));

export const TABLE_EDITION = mysqlTable(TABLE_NAME_EDITION, (t) => ({
  id: t.int().primaryKey().autoincrement(),
  name: t.varchar({ length: 50 }).notNull().unique(),
  order: t.int().notNull(),
  isPublic: t.boolean().notNull(),
}));

export const TABLE_RACE = mysqlTable(
  TABLE_NAME_RACE,
  (t) => ({
    id: t.int().primaryKey().autoincrement(),
    editionId: t
      .int()
      .references(() => TABLE_EDITION.id)
      .notNull(),
    name: t.varchar({ length: 50 }).notNull(),
    startTime: date(DEFAULT_DATE_PARAMS).notNull(),
    duration: t.int({ unsigned: true }).notNull(),
    initialDistance: t.decimal({ precision: 10, scale: 3 }).notNull(),
    lapDistance: t.decimal({ precision: 10, scale: 3 }).notNull(),
    order: t.int().notNull(),
    isPublic: t.boolean().notNull(),
    isBasicRanking: t.boolean().notNull(),
  }),
  (t) => [unique().on(t.name, t.editionId)],
);

export const TABLE_RUNNER = mysqlTable(TABLE_NAME_RUNNER, (t) => ({
  id: t.int().primaryKey().autoincrement(),
  firstname: t.varchar({ length: 255 }).notNull(),
  lastname: t.varchar({ length: 255 }).notNull(),
  gender: t.varchar({ length: 1, enum: GENDERS }).notNull(),
  birthYear: t.varchar({ length: 4 }).notNull(),
  countryCode: countryCode(),
  isPublic: t.boolean().notNull(),
}));

export const TABLE_PARTICIPANT = mysqlTable(
  TABLE_NAME_PARTICIPANT,
  (t) => ({
    id: t.int().primaryKey().autoincrement(),
    raceId: t
      .int()
      .references(() => TABLE_RACE.id)
      .notNull(),
    runnerId: t
      .int()
      .references(() => TABLE_RUNNER.id)
      .notNull(),
    bibNumber: t.int().notNull(),
    stopped: t.boolean().notNull(),
    finalDistance: t.decimal({ precision: 10, scale: 3 }).notNull(),
  }),
  (t) => [unique().on(t.raceId, t.runnerId), unique().on(t.raceId, t.bibNumber)],
);

export const TABLE_PASSAGE = mysqlTable(TABLE_NAME_PASSAGE, (t) => ({
  id: t.int().primaryKey().autoincrement(),
  detectionId: t.int().unique(), // Not null if the passage comes from a detection of the timing system
  importTime: date(DEFAULT_DATE_PARAMS), // same
  participantId: t
    .int()
    .references(() => TABLE_PARTICIPANT.id)
    .notNull(),
  time: date(DEFAULT_DATE_PARAMS).notNull(),
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
  expirationDate: date(DEFAULT_DATE_PARAMS).notNull(),
}));
