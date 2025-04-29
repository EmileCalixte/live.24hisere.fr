import type { PassageOrigin, UnionTypeRecord } from "../../types";

export const PASSAGE_ORIGIN: UnionTypeRecord<PassageOrigin> = {
  /**
   * The passage was imported from a DAG file
   */
  DAG: "DAG",

  /**
   * The passage was imported from a CSV file with a command
   */
  CSV: "CSV",

  /**
   * The passage was added manually by an administrator
   */
  MANUAL: "MANUAL",
};

export const PASSAGE_ORIGINS = [PASSAGE_ORIGIN.DAG, PASSAGE_ORIGIN.CSV, PASSAGE_ORIGIN.MANUAL] as const;
