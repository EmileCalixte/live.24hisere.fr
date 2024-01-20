import { type GenderWithMixed } from "../types/Gender";
import { type RankingType } from "../types/Ranking";

export function getRankingType(categoryCode: string | null, gender: GenderWithMixed): RankingType {
    if (gender !== "mixed") {
        return categoryCode ? "categoryGender" : "scratchGender";
    }

    return categoryCode ? "categoryMixed" : "scratchMixed";
}
