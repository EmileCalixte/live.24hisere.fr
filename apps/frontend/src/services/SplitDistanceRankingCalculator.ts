import { getCategory } from "@emilecalixte/ffa-categories";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type {
  MinimalRankingRunnerInput,
  RankingRunnerRanks,
  SplitDistanceRanking,
  SplitDistanceRankingRunner,
} from "../types/Ranking";
import { approximateTimeToDistance } from "../utils/passageUtils";

type CategoryGenderState = Record<GenderWithMixed, { rank: number; lastRunnerId: number | null }>;

export class SplitDistanceRankingCalculator<TRunner extends MinimalRankingRunnerInput> {
  private currentRanksByCategory: Record<string, CategoryGenderState> = {
    scratch: {
      mixed: { rank: 0, lastRunnerId: null },
      M: { rank: 0, lastRunnerId: null },
      F: { rank: 0, lastRunnerId: null },
    },
  };

  private readonly reached: Array<{ runner: TRunner; raceTime: number; exact: boolean }>;

  constructor(
    private readonly race: PublicRace,
    runners: TRunner[],
    private readonly distance: number,
  ) {
    this.reached = runners
      .filter((runner) => runner.raceId === this.race.id)
      .map((runner) => {
        const result = approximateTimeToDistance(
          this.distance,
          runner.passages,
          runner.totalDistance,
          this.race.duration,
        );

        return { runner, raceTime: result.raceTime, exact: result.exact };
      })
      .filter((entry): entry is { runner: TRunner; raceTime: number; exact: boolean } => entry.raceTime !== null)
      .toSorted((a, b) => a.raceTime - b.raceTime || a.runner.bibNumber - b.runner.bibNumber);
  }

  public getRanking(): SplitDistanceRanking<TRunner> {
    return this.computeRanks();
  }

  private computeRanks(): SplitDistanceRanking<TRunner> {
    const ranking: SplitDistanceRanking<TRunner> = [];

    for (const { runner, raceTime, exact } of this.reached) {
      const categoryCode = runner.customCategoryId
        ? `CUSTOM_${runner.customCategoryId}`
        : getCategory(Number(runner.birthYear), { date: new Date(this.race.startTime) }).code;

      this.ensureCategoryCodeIsInCurrentRanks(categoryCode);

      this.currentRanksByCategory.scratch.mixed.rank += 1;
      this.currentRanksByCategory.scratch[runner.gender].rank += 1;
      this.currentRanksByCategory[categoryCode].mixed.rank += 1;
      this.currentRanksByCategory[categoryCode][runner.gender].rank += 1;

      const ranks: RankingRunnerRanks = {
        actual: {
          scratchMixed: this.currentRanksByCategory.scratch.mixed.rank,
          scratchGender: this.currentRanksByCategory.scratch[runner.gender].rank,
          categoryMixed: this.currentRanksByCategory[categoryCode].mixed.rank,
          categoryGender: this.currentRanksByCategory[categoryCode][runner.gender].rank,
        },
        displayed: {
          scratchMixed: 0,
          scratchGender: 0,
          categoryMixed: 0,
          categoryGender: 0,
        },
      };

      const prevScratchMixed = this.getCurrentLastRunner("scratch", "mixed", ranking);
      const prevScratchGender = this.getCurrentLastRunner("scratch", runner.gender, ranking);
      const prevCategoryMixed = this.getCurrentLastRunner(categoryCode, "mixed", ranking);
      const prevCategoryGender = this.getCurrentLastRunner(categoryCode, runner.gender, ranking);

      ranks.displayed.scratchMixed =
        prevScratchMixed?.raceTime === raceTime
          ? prevScratchMixed.ranks.displayed.scratchMixed
          : ranks.actual.scratchMixed;

      ranks.displayed.scratchGender =
        prevScratchGender?.raceTime === raceTime
          ? prevScratchGender.ranks.displayed.scratchGender
          : ranks.actual.scratchGender;

      ranks.displayed.categoryMixed =
        prevCategoryMixed?.raceTime === raceTime
          ? prevCategoryMixed.ranks.displayed.categoryMixed
          : ranks.actual.categoryMixed;

      ranks.displayed.categoryGender =
        prevCategoryGender?.raceTime === raceTime
          ? prevCategoryGender.ranks.displayed.categoryGender
          : ranks.actual.categoryGender;

      this.currentRanksByCategory.scratch.mixed.lastRunnerId = runner.id;
      this.currentRanksByCategory.scratch[runner.gender].lastRunnerId = runner.id;
      this.currentRanksByCategory[categoryCode].mixed.lastRunnerId = runner.id;
      this.currentRanksByCategory[categoryCode][runner.gender].lastRunnerId = runner.id;

      ranking.push({
        ...runner,
        ranks,
        raceTime,
        exact,
      });
    }

    return ranking;
  }

  private ensureCategoryCodeIsInCurrentRanks(categoryCode: string): void {
    if (!(categoryCode in this.currentRanksByCategory)) {
      this.currentRanksByCategory[categoryCode] = {
        mixed: { rank: 0, lastRunnerId: null },
        M: { rank: 0, lastRunnerId: null },
        F: { rank: 0, lastRunnerId: null },
      };
    }
  }

  private getCurrentLastRunner(
    category: string,
    gender: GenderWithMixed,
    ranking: SplitDistanceRanking<TRunner>,
  ): SplitDistanceRankingRunner<TRunner> | null {
    if (!(category in this.currentRanksByCategory)) {
      return null;
    }

    const lastRunnerId = this.currentRanksByCategory[category][gender].lastRunnerId;

    if (lastRunnerId === null) {
      return null;
    }

    return ranking.find((runner) => runner.id === lastRunnerId) ?? null;
  }
}
