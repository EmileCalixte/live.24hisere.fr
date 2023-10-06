import { Col } from "react-bootstrap";
import { CATEGORY_SCRATCH } from "../../../constants/Category";
import {
    CATEGORY_SCRATCH_SELECT_OPTION,
    GENDER_WITH_MIXED_OPTIONS,
    RANKING_TIME_MODE_OPTIONS,
} from "../../../constants/Forms";
import { RANKING_TIME_MODE } from "../../../constants/RankingTimeMode";
import { getCategoriesDictSelectOptions } from "../../../helpers/categoryHelper";
import { type CategoriesDict, type CategoryShortCode } from "../../../types/Category";
import { type SelectOption } from "../../../types/Forms";
import { type GenderWithMixed } from "../../../types/Gender";
import { type RankingTimeMode } from "../../../types/RankingTimeMode";
import RadioGroup from "../../ui/forms/RadioGroup";
import Select from "../../ui/forms/Select";
import RankingSettingsTime from "./RankingSettingsTime";
import React, { useMemo } from "react";

interface RankingSettingsProps {
    categories: CategoriesDict | false;
    onCategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => any;
    setGender: (gender: GenderWithMixed) => any;
    setTimeMode: (timeMode: RankingTimeMode) => any;
    onRankingTimeSave: (time: number) => any;
    selectedCategory: CategoryShortCode | null;
    selectedGender: GenderWithMixed;
    selectedTimeMode: RankingTimeMode;
    currentRankingTime: number;
    maxRankingTime: number;
}

export default function RankingSettings({
    categories,
    onCategorySelect,
    setGender,
    setTimeMode,
    onRankingTimeSave,
    selectedCategory,
    selectedGender,
    selectedTimeMode,
    currentRankingTime,
    maxRankingTime,
}: RankingSettingsProps): React.ReactElement {
    const categoriesOptions = useMemo<SelectOption[]>(() => {
        return [CATEGORY_SCRATCH_SELECT_OPTION, ...getCategoriesDictSelectOptions(categories)];
    }, [categories]);

    return (
        <>
            <Col xxl={2} xl={3} lg={3} md={4} sm={6} xs={12}>
                <Select label="Catégorie"
                        options={categoriesOptions}
                        value={selectedCategory ?? CATEGORY_SCRATCH}
                        onChange={onCategorySelect}
                />
            </Col>

            <Col>
                <RadioGroup legend="Genre"
                            options={GENDER_WITH_MIXED_OPTIONS}
                            value={selectedGender}
                            onSelectOption={option => setGender(option.value)}
                />
            </Col>

            <Col>
                <RadioGroup legend="Heure"
                            options={RANKING_TIME_MODE_OPTIONS}
                            value={selectedTimeMode}
                            onSelectOption={option => setTimeMode(option.value)}
                />

                <RankingSettingsTime isVisible={selectedTimeMode === RANKING_TIME_MODE.at}
                                     currentRankingTime={currentRankingTime}
                                     onRankingTimeSave={onRankingTimeSave}
                                     maxRankingTime={maxRankingTime}
                />
            </Col>
        </>
    );
}
