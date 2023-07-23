import { Injectable } from "@nestjs/common";
import { type Passage, type Runner } from "@prisma/client";
import { type Ranking } from "../types/Ranking";
import { spaceship } from "../utils/compare.utils";

@Injectable()
export class RankingService {
    calculateRanking(runners: Runner[], passages: Passage[]): Ranking {
        const ranking: Ranking = [];

        for (const passage of passages) {
            let rankingRunner = ranking.find(r => r.id === passage.runnerId);

            if (!rankingRunner) {
                const runner = runners.find(r => r.id === passage.runnerId);

                if (!runner) {
                    continue;
                }

                rankingRunner = {
                    ...runner,
                    passageCount: 0,
                    lastPassageTime: new Date(0),
                };

                ranking.push(rankingRunner);
            }

            rankingRunner.passageCount++;

            if (rankingRunner.lastPassageTime.getTime() < passage.time.getTime()) {
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
