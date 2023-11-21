import "../../css/print-ranking-table.css";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { GENDER_MIXED } from "../../constants/gender";
import { RANKING_TIME_MODE } from "../../constants/rankingTimeMode";
import { useIntervalApiRequest } from "../../hooks/useIntervalApiRequest";
import { getRaces } from "../../services/api/RaceService";
import { excludeKeys } from "../../utils/objectUtils";
import { getDateFromRaceTime, getRacesSelectOptions } from "../../utils/raceUtils";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { RankingCalculator } from "../../services/RankingCalculator";
import { type CategoriesDict, type CategoryShortCode } from "../../types/Category";
import { type GenderWithMixed } from "../../types/Gender";
import { type Race } from "../../types/Race";
import { type Ranking } from "../../types/Ranking";
import { type RankingTimeMode } from "../../types/RankingTimeMode";
import { existingCategories, getCategoryCodeFromBirthYear } from "../../utils/ffaUtils";
import { appDataContext } from "../App";
import Select from "../ui/forms/Select";
import Page from "../ui/Page";
import CircularLoader from "../ui/CircularLoader";
import RankingSettings from "../viewParts/ranking/RankingSettings";
import RankingTable from "../viewParts/ranking/rankingTable/RankingTable";
import ResponsiveRankingTable from "../viewParts/ranking/rankingTable/responsive/ResponsiveRankingTable";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

export default function RankingView(): React.ReactElement {
    const { rankings, runners, passages } = React.useContext(appDataContext);

    const [selectedRace, setSelectedRace] = React.useState<Race | null>(null);

    const [selectedCategory, setSelectedCategory] = React.useState<CategoryShortCode | null>(null);
    const [selectedGender, setSelectedGender] = React.useState<GenderWithMixed>(GENDER_MIXED);
    const [selectedTimeMode, setSelectedTimeMode] = React.useState<RankingTimeMode>(RANKING_TIME_MODE.now);
    const [selectedRankingTime, setSelectedRankingTime] = React.useState(-1); // Set when a race is selected, in ms

    const { width: windowWidth } = useWindowDimensions();

    const races = useIntervalApiRequest(getRaces).json?.races;

    const racesOptions = React.useMemo(() => {
        return getRacesSelectOptions(races);
    }, [races]);

    const ranking = React.useMemo<Ranking | null>(() => {
        if (!selectedRace || !rankings) {
            return null;
        }

        return rankings.get(selectedRace.id) ?? null;
    }, [selectedRace, rankings]);

    const rankingAtSelectedRankingTime = React.useMemo<Ranking | null>(() => {
        if (!selectedRace || !runners || !passages) {
            return null;
        }

        if (selectedTimeMode !== RANKING_TIME_MODE.at) {
            return null;
        }

        const rankingCalculator = new RankingCalculator(
            selectedRace,
            runners,
            getDateFromRaceTime(selectedRace, selectedRankingTime),
        );

        return rankingCalculator.getRanking();
    }, [selectedRace, runners, passages, selectedTimeMode, selectedRankingTime]);

    const displayedRanking = React.useMemo<Ranking | null>(() => {
        if (selectedTimeMode !== RANKING_TIME_MODE.at) {
            return ranking;
        }

        return rankingAtSelectedRankingTime;
    }, [ranking, rankingAtSelectedRankingTime, selectedTimeMode]);

    const shouldResetRankingTime = React.useCallback((newRaceDuration: number) => {
        if (selectedRankingTime < 0) {
            return true;
        }

        if (selectedRace && selectedRankingTime > newRaceDuration * 1000) {
            return true;
        }

        // For better UX, if the user looks at the current time rankings, we want to reset the time inputs to the
        // duration of the newly selected race
        return selectedTimeMode === RANKING_TIME_MODE.now;
    }, [selectedRankingTime, selectedRace, selectedTimeMode]);

    const onSelectRace = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!races) {
            return;
        }

        const raceId = parseInt(e.target.value);

        const race = races.find(race => race.id === raceId);

        if (!race) {
            return;
        }

        setSelectedRace(race);

        if (shouldResetRankingTime(race.duration)) {
            setSelectedRankingTime(race.duration * 1000);
        }
    }, [races, shouldResetRankingTime]);

    const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        if (e.target.value === "scratch") {
            setSelectedCategory(null);
            return;
        }

        setSelectedCategory(e.target.value);
    };

    /**
     * @param time The new ranking time from race start in ms
     */
    const onRankingTimeSave = async (time: number): Promise<void> => {
        setSelectedRankingTime(time);
    };

    const categories = React.useMemo<CategoriesDict | false>(() => {
        if (!ranking) {
            return false;
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

            {selectedRace &&
                <>
                    <Row className="hide-on-print mb-3 row-cols-auto">
                        <RankingSettings
                            categories={categories}
                            onCategorySelect={onCategorySelect}
                            setGender={setSelectedGender}
                            setTimeMode={setSelectedTimeMode}
                            onRankingTimeSave={onRankingTimeSave}
                            selectedCategory={selectedCategory}
                            selectedGender={selectedGender}
                            selectedTimeMode={selectedTimeMode}
                            currentRankingTime={selectedRankingTime}
                            maxRankingTime={selectedRace.duration * 1000}
                        />
                    </Row>

                    {!ranking &&
                        <CircularLoader />
                    }

                    {displayedRanking &&
                        <Row>
                            <Col>
                                {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH &&
                                    <RankingTable
                                        race={selectedRace}
                                        ranking={displayedRanking}
                                        tableCategory={selectedCategory}
                                        tableGender={selectedGender}
                                        tableRaceDuration={selectedTimeMode === RANKING_TIME_MODE.at ? selectedRankingTime : null}
                                    />
                                }

                                {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH &&
                                    <div>
                                        <div className="mb-3">
                                            Cliquez sur un coureur pour consulter ses données de course
                                        </div>

                                        <ResponsiveRankingTable
                                            race={selectedRace}
                                            ranking={displayedRanking}
                                            tableCategory={selectedCategory}
                                            tableGender={selectedGender}
                                            tableRaceDuration={selectedTimeMode === RANKING_TIME_MODE.at ? selectedRankingTime : null}
                                        />
                                    </div>
                                }
                            </Col>
                        </Row>
                    }
                </>
            }
        </Page>
    );
}
