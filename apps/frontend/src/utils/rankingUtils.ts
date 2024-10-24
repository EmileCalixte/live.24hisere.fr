import { type GenderWithMixed } from "@live24hisere/types";
import { type RankingType } from "../types/Ranking";

export function getRankingType(
    categoryCode: string | null,
    gender: GenderWithMixed,
): RankingType {
    if (gender !== "mixed") {
        return categoryCode ? "categoryGender" : "scratchGender";
    }

    return categoryCode ? "categoryMixed" : "scratchMixed";
}
