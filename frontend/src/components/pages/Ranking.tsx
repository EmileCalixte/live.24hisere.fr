import "../../css/print-ranking-table.css";
import React, {useState, useEffect, useCallback, useMemo} from "react";
import {Col, Row} from "react-bootstrap";
import {GENDER_MIXED} from "../../constants/Gender";
import {RANKING_TIME_MODE} from "../../constants/RankingTimeMode";
import {getRacesSelectOptions} from "../../helpers/raceHelper";
import {useWindowDimensions} from "../../hooks/useWindowDimensions";
import {existingCategories, getCategoryCodeFromBirthYear} from "../../util/ffaUtils";
import Select from "../ui/forms/Select";
import Page from "../ui/Page";
import CircularLoader from "../ui/CircularLoader";
import RankingSettings from "../pageParts/ranking/RankingSettings";
import {performAPIRequest} from "../../util/apiUtils";
import RankingTable from "../pageParts/ranking/rankingTable/RankingTable";
import {RankingProcesser} from "../../util/RankingProcesser";
import {formatDateForApi} from "../../util/utils";
import ResponsiveRankingTable from "../pageParts/ranking/rankingTable/responsive/ResponsiveRankingTable";

const RANKING_UPDATE_INTERVAL_TIME = 20 * 1000;

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

export default function Ranking() {
    const [races, setRaces] = useState<Race[] | false>(false);
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);

    const [processedRanking, setProcessedRanking] = useState<ProcessedRanking | false>(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryShortCode | null>(null);
    const [selectedGender, setSelectedGender] = useState<GenderWithMixed>(GENDER_MIXED);
    const [selectedTimeMode, setSelectedTimeMode] = useState(RANKING_TIME_MODE.now);
    const [selectedRankingTime, setSelectedRankingTime] = useState(-1); // Set when a race is selected

    const {width: windowWidth} = useWindowDimensions();

    const racesOptions = useMemo(() => {
        return getRacesSelectOptions(races);
    }, [races]);

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

        if (selectedTimeMode === RANKING_TIME_MODE.at) {
            const rankingDate = new Date();
            rankingDate.setTime(new Date(selectedRace.startTime).getTime() + rankingTime);
            const rankingDateString = formatDateForApi(rankingDate);
            requestUrl += `?at=${rankingDateString}`;
        }

        const response = await performAPIRequest(requestUrl);
        const responseJson = await response.json();

        setProcessedRanking(new RankingProcesser(selectedRace, responseJson.ranking as Ranking).getProcessedRanking());
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
        if (selectedTimeMode === RANKING_TIME_MODE.now) {
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

    /**
     * @param time The new ranking time from race start in ms
     */
    const onRankingTimeSave = async (time: number) => {
        setSelectedRankingTime(time);
    };

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
            categoriesInRanking.add(getCategoryCodeFromBirthYear(runner.birthYear));
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

                    {!processedRanking &&
                        <CircularLoader />
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
                                            ranking={processedRanking}
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
