import { MySqlTableWithColumns } from "drizzle-orm/mysql-core/table";

export type DrizzleTableColumns<T extends MySqlTableWithColumns<any>> =
    T["_"]["columns"];
