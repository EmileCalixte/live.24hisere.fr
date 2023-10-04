import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { PassageService } from "../services/database/entities/passage.service";
import { RaceService } from "../services/database/entities/race.service";
import { RunnerService } from "../services/database/entities/runner.service";
import { RankingService } from "../services/ranking.service";
import { QueryParam } from "../types/QueryParam";
import { type Ranking } from "../types/Ranking";
import { type RankingResponse } from "../types/responses/Ranking";
import { isDateValid } from "../utils/date.utils";

interface CachedRanking {
    ranking: Ranking;
    calculatedAt: Date;
}

// The time (in ms) during which the controller can return a cached ranking, without recalculating it from the database data
const RANKING_CACHE_DURATION = 5000;

/**
 * @deprecated
 */
@Controller()
export class RankingController {
    private readonly cachedRankings = new Map<number, CachedRanking>();

    constructor(
        private readonly passageService: PassageService,
        private readonly raceService: RaceService,
        private readonly rankingService: RankingService,
        private readonly runnerService: RunnerService,
    ) {}

    @Get("/ranking/:raceId")
    async getRanking(@Param("raceId") raceId: string, @Query("at") at: QueryParam): Promise<RankingResponse> {
        const id = Number(raceId);

        if (isNaN(id)) {
            throw new BadRequestException("Race ID must be a number");
        }

        const race = await this.raceService.getPublicRace({ id });

        if (!race) {
            throw new NotFoundException("Race not found");
        }

        const rankingDate = this.getRankingDateFromQueryParam(at);

        const [raceRunners, passages] = await Promise.all([
            this.runnerService.getPublicRunnersOfRace(race.id),
            this.passageService.getAllPublicPassages(),
        ]);

        if (!rankingDate && this.canReturnCachedRanking(race.id)) {
            return {
                ranking: (this.cachedRankings.get(race.id) as CachedRanking).ranking,
            };
        }

        const ranking = this.rankingService.calculateRanking(raceRunners, passages, rankingDate);

        if (!rankingDate) {
            this.cachedRankings.set(race.id, {
                ranking,
                calculatedAt: new Date(),
            });
        }

        return { ranking };
    }

    private getRankingDateFromQueryParam(queryAt: string | undefined): Date | undefined {
        if (!queryAt) {
            return undefined;
        }

        const date = new Date(queryAt);

        if (!isDateValid(date)) {
            return undefined;
        }

        return date;
    }

    private canReturnCachedRanking(raceId: number): boolean {
        if (!this.cachedRankings.has(raceId)) {
            return false;
        }

        return new Date() <= new Date((this.cachedRankings.get(raceId) as CachedRanking).calculatedAt.getTime() + RANKING_CACHE_DURATION);
    }
}
