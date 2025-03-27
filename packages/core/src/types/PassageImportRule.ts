export interface PassageImportRule {
  id: number;
  url: string;
  isActive: boolean;
}

export interface PassageImportRuleWithRaceIds extends PassageImportRule {
  /**
   * IDs of races linked to the rule
   */
  raceIds: number[];
}
