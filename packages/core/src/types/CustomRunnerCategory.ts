import type { RaceRunner } from "./Runner";

export interface CustomRunnerCategory {
  /**
   * The category ID
   */
  id: number;

  /**
   * The code of the category
   */
  code: string;

  /**
   * The displayed name of the category
   */
  name: string;
}

export interface CustomRunnerCategoryWithRunnerCount extends CustomRunnerCategory {
  /**
   * The number of runners to whom this category is assigned
   */
  runnerCount: number;
}

export interface CustomRunnerCategoryWithRunners extends CustomRunnerCategory {
  /**
   * The list of the runners to whom this category is assigned
   */
  runners: RaceRunner[];
}
