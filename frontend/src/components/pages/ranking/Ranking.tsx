import '../../../css/print-ranking-table.css';
import React, {useState, useEffect, useCallback, useMemo} from "react";
import {Race} from "../../../types/Race";
import {existingCategories} from "../../../util/FfaUtil";
import RankingRaceSelector from "./RankingRaceSelector";
import RankingSettings from "./RankingSettings";
import ApiUtil from "../../../util/ApiUtil";
import RankingTable from "./RankingTable";
import {RankingProcesser} from "../../../util/RankingUtil";
import {app} from "../../App";
import Util from "../../../util/Util";
import {CategoriesDict, CategoryShortCode} from "../../../types/Category";
import {ProcessedRanking, Ranking as RankingType} from "../../../types/Ranking";
import {GenderWithMixed} from "../../../types/Runner";

export enum Category {
    All = 'all',
    Team = 'team',
}

export enum TimeMode {
    Now = 'now',
    At = 'at',
}

const RANKING_UPDATE_INTERVAL_TIME = 30000;

const Ranking = () => {
    const [races, setRaces] = useState<Race[] | false>(false);
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);

    const [processedRanking, setProcessedRanking] = useState<ProcessedRanking>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(Category.All);
    const [selectedGender, setSelectedGender] = useState<GenderWithMixed>("mixed");
    const [selectedTimeMode, setSelectedTimeMode] = useState(TimeMode.Now);
    const [selectedRankingTime, setSelectedRankingTime] = useState(-1); // Set when a race is selected

    const fetchRaces = useCallback(async () => {
        const response = await ApiUtil.performAPIRequest('/races');
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
            rankingDate.setTime(app.state.raceStartTime.getTime() + rankingTime);
            const rankingDateString = Util.formatDateForApi(rankingDate);
            requestUrl += `?at=${rankingDateString}`;
        }

        app.setState({
            isFetching: true,
        });

        const response = await ApiUtil.performAPIRequest(requestUrl);
        const responseJson = await response.json();

        app.setState({
            isFetching: false,
        });

        setProcessedRanking(new RankingProcesser(responseJson.ranking as RankingType).getProcessedRanking());
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

        if (shouldResetRankingTime(race.duration)) {
            setSelectedRankingTime(race.duration * 1000);
        }
    }, [races, shouldResetRankingTime]);

    const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    }

    const onGenderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedGender(e.target.value as GenderWithMixed);
    }

    const onTimeModeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTimeMode(e.target.value as TimeMode);
    }

    /**
     * @param time The new ranking time from race start in ms
     */
    const onRankingTimeSave = async (time: number) => {
        setSelectedRankingTime(time);
    }

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    useEffect(() => {
        fetchRanking();

        const refreshRankingInterval = setInterval(fetchRanking, RANKING_UPDATE_INTERVAL_TIME);
        return (() => clearInterval(refreshRankingInterval));
    }, [fetchRanking]);

    const categories = useMemo<CategoriesDict | false>(() => {
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

    return(
        <div id="page-ranking">
            <div className="row hide-on-print">
                <div className="col-12">
                    <h1>Classements</h1>
                </div>
            </div>

            <div className="row hide-on-print mb-3">
                <div className="col-12">
                    <RankingRaceSelector races={races}
                                         onSelectRace={onSelectRace}
                                         selectedRaceId={selectedRace ? selectedRace.id : undefined}
                    />
                </div>
            </div>

            {selectedRace &&
            <>
                <div className="row hide-on-print mb-3">
                    <div className="col-12">
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
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <RankingTable
                            race={selectedRace}
                            ranking={processedRanking}
                            tableCategory={selectedCategory}
                            tableGender={selectedGender}
                            tableRaceDuration={selectedTimeMode === TimeMode.At ? selectedRankingTime : null}
                        />
                    </div>
                </div>
            </>
            }
        </div>
    );
}

export default Ranking;
