import { Injectable } from "@nestjs/common";
import { type Passage, type Runner } from "@prisma/client";
import { type Ranking } from "../types/Ranking";
import { spaceship } from "../utils/compare.utils";

@Injectable()
export class RankingService {
    /**
     * @param runners The list of the runners who are part of the desired ranking
     * @param passages The list of all the passages used to compute ranking
     * @param rankingDate A date beyond which passages are excluded from the calculation
     */
    calculateRanking(runners: Runner[], passages: Passage[], rankingDate?: Date): Ranking {
        const ranking: Ranking = runners.map(runner => ({
            ...runner,
            passageCount: 0,
            lastPassageTime: null,
        }));

        for (const passage of passages) {
            if (rankingDate && (passage.time > rankingDate)) {
                continue;
            }

            const rankingRunner = ranking.find(r => r.id === passage.runnerId);

            if (!rankingRunner) {
                continue; // This passage's runner is not part of the ranking
            }

            rankingRunner.passageCount++;

            if (!rankingRunner.lastPassageTime || rankingRunner.lastPassageTime.getTime() < passage.time.getTime()) {
                rankingRunner.lastPassageTime = new Date(passage.time);
            }
        }

        return ranking.sort((runnerA, runnerB) => {
            if (runnerA.passageCount === runnerB.passageCount) {
                return spaceship(runnerB.lastPassageTime, runnerA.lastPassageTime);
            }

            return spaceship(runnerB.passageCount, runnerA.passageCount);
        });
    }
}
