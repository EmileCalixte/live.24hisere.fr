import "../../css/print-ranking-table.css";
import React, {useState, useEffect, useCallback, useMemo} from "react";
import {Col, Row} from "react-bootstrap";
import {type Race} from "../../types/Race";
import {existingCategories} from "../../util/ffaUtils";
import Page from "../layout/Page";
import CircularLoader from "../layout/CircularLoader";
import RankingRaceSelector from "../pageParts/ranking/RankingRaceSelector";
import RankingSettings from "../pageParts/ranking/RankingSettings";
import {performAPIRequest} from "../../util/apiUtils";
import RankingTable from "../pageParts/ranking/rankingTable/RankingTable";
import {RankingProcesser} from "../../util/RankingProcesser";
import {formatDateForApi} from "../../util/utils";
import {type CategoriesDict, type CategoryShortCode} from "../../types/Category";
import {type ProcessedRanking, type Ranking as RankingType} from "../../types/Ranking";
import {type GenderWithMixed} from "../../types/Runner";
import ResponsiveRankingTable from "../pageParts/ranking/rankingTable/responsive/ResponsiveRankingTable";

export enum TimeMode {
    Now = "now",
    At = "at",
}

const RANKING_UPDATE_INTERVAL_TIME = 20 * 1000;

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

export default function Ranking() {
    const [races, setRaces] = useState<Race[] | false>(false);
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);

    const [processedRanking, setProcessedRanking] = useState<ProcessedRanking | false>(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryShortCode | null>(null);
    const [selectedGender, setSelectedGender] = useState<GenderWithMixed>("mixed");
    const [selectedTimeMode, setSelectedTimeMode] = useState(TimeMode.Now);
    const [selectedRankingTime, setSelectedRankingTime] = useState(-1); // Set when a race is selected

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const fetchRaces = useCallback(async () => {
        const response = await performAPIRequest("/races");
        const responseJson = await response.json();

        setRaces(responseJson.races as Race[]);
    }, []);

    const fetchRanking = useCallback(async (rankingTime = selectedRankingTime) => {
        if (selectedRace === null) {
            return;
        }

        let requestUrl = `/ranking/${selectedRace.id}`;

        if (selectedTimeMode === TimeMode.At) {
            const rankingDate = new Date();
            rankingDate.setTime(new Date(selectedRace.startTime).getTime() + rankingTime);
            const rankingDateString = formatDateForApi(rankingDate);
            requestUrl += `?at=${rankingDateString}`;
        }

        const response = await performAPIRequest(requestUrl);
        const responseJson = await response.json();

        setProcessedRanking(new RankingProcesser(selectedRace, responseJson.ranking as RankingType).getProcessedRanking());
    }, [selectedRace, selectedRankingTime, selectedTimeMode]);

    const shouldResetRankingTime = useCallback((newRaceDuration: number) => {
        if (selectedRankingTime < 0) {
            return true;
        }

        if (selectedRace && selectedRankingTime > newRaceDuration * 1000) {
            return true;
        }

        // For better UX, if the user looks at the current time rankings, we want to reset the time inputs to the
        // duration of the newly selected race
        if (selectedTimeMode === TimeMode.Now) {
            return true;
        }

        return false;
    }, [selectedRankingTime, selectedRace, selectedTimeMode]);

    const onSelectRace = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!races) {
            return;
        }

        const raceId = parseInt(e.target.value);

        const race = races.find(race => race.id === raceId);

        if (!race) {
            return;
        }

        setSelectedRace(race);
        setProcessedRanking(false);

        if (shouldResetRankingTime(race.duration)) {
            setSelectedRankingTime(race.duration * 1000);
        }
    }, [races, shouldResetRankingTime]);

    const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "scratch") {
            setSelectedCategory(null);
            return;
        }

        setSelectedCategory(e.target.value);
    };

    const onGenderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedGender(e.target.value as GenderWithMixed);
    };

    const onTimeModeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTimeMode(e.target.value as TimeMode);
    };

    /**
     * @param time The new ranking time from race start in ms
     */
    const onRankingTimeSave = async (time: number) => {
        setSelectedRankingTime(time);
    };

    useEffect(() => {
        const onResize = (e: UIEvent) => {
            setWindowWidth((e.target as Window).innerWidth);
        };

        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    useEffect(() => {
        fetchRanking();

        const refreshRankingInterval = setInterval(fetchRanking, RANKING_UPDATE_INTERVAL_TIME);
        return () => clearInterval(refreshRankingInterval);
    }, [fetchRanking]);

    const categories = useMemo<CategoriesDict | false>(() => {
        if (!processedRanking) {
            return false;
        }

        const categoriesInRanking = new Set<CategoryShortCode>();

        for (const runner of processedRanking) {
            categoriesInRanking.add(runner.category);
        }

        const categories = {...existingCategories};

        for (const categoryCode in categories) {
            if (!categoriesInRanking.has(categoryCode)) {
                delete categories[categoryCode];
            }
        }

        return categories;
    }, [processedRanking]);

    return (
        <Page id="ranking" title="Classements">
            <Row className="hide-on-print">
                <Col>
                    <h1>Classements</h1>
                </Col>
            </Row>

            <Row className="hide-on-print mb-3">
                <Col>
                    <RankingRaceSelector races={races}
                                         onSelectRace={onSelectRace}
                                         selectedRaceId={selectedRace ? selectedRace.id : undefined}
                    />
                </Col>
            </Row>

            {selectedRace &&
                <>
                    <Row className="hide-on-print mb-3">
                        <Col>
                            <RankingSettings
                                categories={categories}
                                onCategorySelect={onCategorySelect}
                                onGenderSelect={onGenderSelect}
                                onTimeModeSelect={onTimeModeSelect}
                                onRankingTimeSave={onRankingTimeSave}
                                selectedCategory={selectedCategory}
                                selectedGender={selectedGender}
                                selectedTimeMode={selectedTimeMode}
                                currentRankingTime={selectedRankingTime}
                                maxRankingTime={selectedRace.duration * 1000}
                            />
                        </Col>
                    </Row>

                    {!processedRanking &&
                        <CircularLoader/>
                    }

                    {processedRanking &&
                        <Row>
                            <Col>
                                {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH &&
                                    <RankingTable
                                        race={selectedRace}
                                        ranking={processedRanking}
                                        tableCategory={selectedCategory}
                                        tableGender={selectedGender}
                                        tableRaceDuration={selectedTimeMode === TimeMode.At ? selectedRankingTime : null}
                                    />
                                }

                                {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH &&
                                    <div>
                                        <div className="mb-3">
                                            Cliquez sur un coureur pour consulter ses données de course
                                        </div>

                                        <ResponsiveRankingTable
                                            race={selectedRace}
                                            ranking={processedRanking}
                                            tableCategory={selectedCategory}
                                            tableGender={selectedGender}
                                            tableRaceDuration={selectedTimeMode === TimeMode.At ? selectedRankingTime : null}
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
