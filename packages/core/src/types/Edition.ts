export interface PublicEdition {
  /**
   * The edition ID
   */
  id: number;

  /**
   * The name of the edition
   */
  name: string;
}

export interface AdminEdition extends PublicEdition {
  /**
   * Whether the edition and its races are publicly displayed or not
   */
  isPublic: boolean;
}

export interface AdminEditionWithOrder extends AdminEdition {
  /**
   * Number used to order editions
   */
  order: number;
}

export type EditionWithRaceCount<TEdition extends PublicEdition = PublicEdition> = TEdition & {
  /**
   * The number of races in the edition
   */
  raceCount: number;
};

export type EditionWithRunnerCount<TEdition extends PublicEdition = PublicEdition> = TEdition & {
  /**
   * The number of runners taking part in the races in this edition
   */
  runnerCount: number;
};

export type AdminEditionWithRaceCount = EditionWithRaceCount<AdminEdition>;

export type AdminEditionWithRaceAndRunnerCount = EditionWithRaceCount<EditionWithRunnerCount<AdminEdition>>;
