import "../../css/print-ranking-table.css";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { RankingTimeMode } from "../../constants/rankingTimeMode";
import { SearchParam } from "../../constants/searchParams";
import { useCategoryQueryString } from "../../hooks/queryString/useCategoryQueryString";
import { useGenderQueryString } from "../../hooks/queryString/useGenderQueryString";
import { useRaceQueryString } from "../../hooks/queryString/useRaceQueryString";
import { useIntervalApiRequest } from "../../hooks/useIntervalApiRequest";
import { useQueryString } from "../../hooks/queryString/useQueryString";
import { useRanking } from "../../hooks/useRanking";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { getRaces } from "../../services/api/RaceService";
import { getRaceRunners } from "../../services/api/RunnerService";
import { type CategoriesDict, type CategoryShortCode } from "../../types/Category";
import { type GenderWithMixed } from "../../types/Gender";
import { type RunnerWithProcessedData, type RunnerWithProcessedPassages } from "../../types/Runner";
import { existingCategories, getCategoryCodeFromBirthYear } from "../../utils/ffaUtils";
import { excludeKeys } from "../../utils/objectUtils";
import { getProcessedPassagesFromPassages, getRunnerProcessedDataFromPassages } from "../../utils/passageUtils";
import { getDateFromRaceTime, getRacesSelectOptions } from "../../utils/raceUtils";
import CircularLoader from "../ui/CircularLoader";
import Select from "../ui/forms/Select";
import Page from "../ui/Page";
import RankingSettings from "../viewParts/ranking/RankingSettings";
import RankingTable from "../viewParts/ranking/rankingTable/RankingTable";
import ResponsiveRankingTable from "../viewParts/ranking/rankingTable/responsive/ResponsiveRankingTable";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

export default function RankingView(): React.ReactElement {
    const { searchParams, setParams, deleteParams } = useQueryString();

    const { selectedGender, setGenderParam, deleteGenderParam } = useGenderQueryString();

    const searchParamsTimeMode = searchParams.get(SearchParam.TIME_MODE);
    const searchParamsRankingTime = searchParams.get(SearchParam.RANKING_TIME);

    // To keep in memory the selected ranking time when the user selects current time ranking mode, in seconds
    const [rankingTimeMemory, setRankingTimeMemory] = React.useState<number | null>(null);

    const { width: windowWidth } = useWindowDimensions();

    const races = useIntervalApiRequest(getRaces).json?.races;

    const { selectedRace, setRaceParam } = useRaceQueryString(races);

    const racesOptions = React.useMemo(() => {
        return getRacesSelectOptions(races);
    }, [races]);

    const selectedTimeMode = React.useMemo<RankingTimeMode>(() => {
        if (searchParamsTimeMode === RankingTimeMode.AT) {
            return RankingTimeMode.AT;
        }

        return RankingTimeMode.NOW;
    }, [searchParamsTimeMode]);

    // Ranking time in ms
    const selectedRankingTime = React.useMemo<number | null>(() => {
        if (selectedTimeMode !== RankingTimeMode.AT) {
            return null;
        }

        if (searchParamsRankingTime === null) {
            return null;
        }

        const time = parseInt(searchParamsRankingTime);

        if (isNaN(time)) {
            return null;
        }

        return time * 1000;
    }, [searchParamsRankingTime, selectedTimeMode]);

    const fetchRunners = React.useMemo(() => {
        if (!selectedRace) {
            return;
        }

        return async () => getRaceRunners(selectedRace.id);
    }, [selectedRace]);

    const runners = useIntervalApiRequest(fetchRunners).json?.runners;

    const processedRunners = React.useMemo<Array<RunnerWithProcessedPassages & RunnerWithProcessedData> | undefined>(() => {
        if (!runners || !selectedRace) {
            return;
        }

        return runners.map(runner => ({
            ...runner,
            ...getRunnerProcessedDataFromPassages(selectedRace, runner.passages),
            passages: getProcessedPassagesFromPassages(selectedRace, runner.passages),
        }));
    }, [runners, selectedRace]);

    const rankingDate = React.useMemo<Date | undefined>(() => {
        if (!selectedRace) {
            return;
        }

        if (selectedTimeMode !== RankingTimeMode.AT || selectedRankingTime === null) {
            return;
        }

        return getDateFromRaceTime(selectedRace, selectedRankingTime);
    }, [selectedRace, selectedRankingTime, selectedTimeMode]);

    const ranking = useRanking(selectedRace ?? undefined, processedRunners, rankingDate);

    const shouldResetRankingTime = React.useCallback((newRaceDuration: number) => {
        if (rankingTimeMemory === null) {
            return true;
        }

        if (rankingTimeMemory < 0) {
            return true;
        }

        if (selectedRace && rankingTimeMemory > newRaceDuration) {
            return true;
        }

        // For better UX, if the user looks at the current time rankings, we want to reset the time inputs to the
        // duration of the newly selected race
        return selectedTimeMode === RankingTimeMode.NOW;
    }, [rankingTimeMemory, selectedRace, selectedTimeMode]);

    const onSelectRace = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRaceParam(e.target.value);

        const race = races?.find(race => race.id.toString() === e.target.value);

        if (!race) {
            return;
        }

        if (shouldResetRankingTime(race.duration)) {
            setRankingTimeMemory(race.duration);
            if (selectedTimeMode === RankingTimeMode.AT) {
                setParams({ [SearchParam.RANKING_TIME]: race.duration.toString() });
            }
        }
    }, [races, selectedTimeMode, setParams, setRaceParam, shouldResetRankingTime]);

    React.useEffect(() => {
        if (!selectedRace) {
            return;
        }

        if (selectedTimeMode === RankingTimeMode.AT && !searchParams.has(SearchParam.RANKING_TIME)) {
            setParams({ [SearchParam.RANKING_TIME]: rankingTimeMemory?.toString() ?? selectedRace.duration.toString() });
        }
    }, [deleteParams, rankingTimeMemory, searchParams, selectedRace, selectedTimeMode, setParams]);

    React.useEffect(() => {
        if (selectedTimeMode !== RankingTimeMode.AT && searchParams.has(SearchParam.RANKING_TIME)) {
            deleteParams(SearchParam.RANKING_TIME);
        }
    }, [deleteParams, searchParams, selectedTimeMode]);

    React.useEffect(() => {
        if (selectedTimeMode !== RankingTimeMode.AT || !selectedRace || selectedRankingTime === null) {
            return;
        }

        if (selectedRankingTime > selectedRace.duration * 1000) {
            setParams({ [SearchParam.RANKING_TIME]: selectedRace.duration.toString() });
            setRankingTimeMemory(selectedRace.duration);
        }
    }, [selectedRace, selectedRankingTime, selectedTimeMode, setParams]);

    const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        if (e.target.value === "scratch") {
            deleteCategoryParam();
            return;
        }

        setCategoryParam(e.target.value);
    };

    const onGenderSelect = (gender: GenderWithMixed): void => {
        if (gender === "mixed") {
            deleteGenderParam();
            return;
        }

        setGenderParam(gender);
    };

    const onTimeModeSelect = (timeMode: RankingTimeMode): void => {
        if (timeMode === RankingTimeMode.NOW) {
            deleteParams(SearchParam.TIME_MODE, SearchParam.RANKING_TIME);
            return;
        }

        setParams({ [SearchParam.TIME_MODE]: timeMode });
    };

    /**
     * @param time The new ranking time from race start in ms
     */
    const onRankingTimeSave = (time: number): void => {
        const timeToSave = Math.floor(time / 1000);

        setParams({ [SearchParam.RANKING_TIME]: timeToSave.toString() });
        setRankingTimeMemory(timeToSave);
    };

    const categories = React.useMemo<CategoriesDict | null>(() => {
        if (!ranking) {
            return null;
        }

        const categoriesInRanking = new Set<CategoryShortCode>();

        for (const runner of ranking) {
            categoriesInRanking.add(getCategoryCodeFromBirthYear(runner.birthYear));
        }

        const categoriesToRemove: Array<keyof CategoriesDict> = [];

        for (const categoryCode in existingCategories) {
            if (!categoriesInRanking.has(categoryCode)) {
                categoriesToRemove.push(categoryCode);
            }
        }

        return excludeKeys(existingCategories, categoriesToRemove);
    }, [ranking]);

    const { selectedCategory, setCategoryParam, deleteCategoryParam } = useCategoryQueryString(selectedRace, categories);

    return (
        <Page id="ranking" title="Classements">
            <Row className="hide-on-print">
                <Col>
                    <h1>Classements</h1>
                </Col>
            </Row>

            <Row className="hide-on-print mb-3">
                <Col xxl={2} xl={3} lg={4} md={6} sm={9} xs={12}>
                    <Select label="Course"
                            options={racesOptions}
                            onChange={onSelectRace}
                            value={selectedRace ? selectedRace.id : undefined}
                            placeholderLabel="Sélectionnez une course"
                    />
                </Col>
            </Row>

            {selectedRace && (
                <>
                    <Row className="hide-on-print mb-3 row-cols-auto">
                        <RankingSettings
                            categories={categories}
                            onCategorySelect={onCategorySelect}
                            onGenderSelect={onGenderSelect}
                            setTimeMode={onTimeModeSelect}
                            onRankingTimeSave={onRankingTimeSave}
                            selectedCategory={selectedCategory}
                            selectedGender={selectedGender}
                            selectedTimeMode={selectedTimeMode}
                            currentRankingTime={selectedRankingTime ?? selectedRace.duration * 1000}
                            maxRankingTime={selectedRace.duration * 1000}
                        />
                    </Row>

                    {!ranking && (
                        <CircularLoader />
                    )}

                    {ranking && (
                        <Row>
                            <Col>
                                {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
                                    <RankingTable
                                        race={selectedRace}
                                        ranking={ranking}
                                        tableCategory={selectedCategory}
                                        tableGender={selectedGender}
                                        tableRaceDuration={selectedTimeMode === RankingTimeMode.AT ? selectedRankingTime : null}
                                    />
                                )}

                                {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
                                    <div>
                                        <div className="mb-3">
                                            Cliquez sur un coureur pour consulter ses données de course
                                        </div>

                                        <ResponsiveRankingTable
                                            race={selectedRace}
                                            ranking={ranking}
                                            tableCategory={selectedCategory}
                                            tableGender={selectedGender}
                                            tableRaceDuration={selectedTimeMode === RankingTimeMode.AT ? selectedRankingTime : null}
                                        />
                                    </div>
                                )}
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </Page>
    );
}
