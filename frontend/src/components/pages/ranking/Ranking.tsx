import '../../../css/print-ranking-table.css';
import React, {useState, useEffect, useCallback} from "react";
import RankingSettings from "./RankingSettings";
import ApiUtil from "../../../util/ApiUtil";
import RankingTable from "./RankingTable";
import RankingUtil from "../../../util/RankingUtil";
import {app} from "../../App";
import Util from "../../../util/Util";
import CategoryType, {CategoriesDict} from "../../../types/Category";
import {ProcessedRanking, Ranking as RankingType} from "../../../types/Ranking";
import {GenderWithMixed} from "../../../types/Runner";

export const CATEGORY_ALL = 'all';
export const CATEGORY_TEAM = 'team';

export enum Category {
    All = 'all',
    Team = 'team',
}

export const GENDER_MIXED = 'mixed';

export enum TimeMode {
    Now = 'now',
    At = 'at',
}

export const RANKING_UPDATE_INTERVAL_TIME = 30000;

const Ranking = () => {

    const [categories, setCategories] = useState<CategoriesDict | false>(false);
    const [processedRanking, setProcessedRanking] = useState<ProcessedRanking>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(Category.All);
    const [selectedGender, setSelectedGender] = useState<GenderWithMixed>("mixed");
    const [selectedTimeMode, setSelectedTimeMode] = useState(TimeMode.Now);
    const [selectedRankingTime, setSelectedRankingTime] = useState(86400 * 1000); // TODO USE RACE DURATION

    const fetchCategories = useCallback(async () => {
        const response = await ApiUtil.performAPIRequest('/categories');
        const responseJson = await response.json();

        const responseCategories: CategoriesDict = {};

        responseJson.categories.forEach((category: CategoryType) => {
            responseCategories[category.code] = category.name;
        });

        setCategories(responseCategories);
    }, []);

    const fetchRanking = useCallback(async (rankingTime = selectedRankingTime) => {
        let requestUrl = '/ranking';

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

        setProcessedRanking(RankingUtil.getProcessedRanking(responseJson.ranking as RankingType));
    }, [selectedRankingTime, selectedTimeMode]);

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
        fetchCategories();
        fetchRanking();

        const refreshRankingInterval = setInterval(fetchRanking, RANKING_UPDATE_INTERVAL_TIME);
        return (() => clearInterval(refreshRankingInterval));
    }, [fetchCategories, fetchRanking]);

    return(
        <div id="page-ranking">
            <div className="row hide-on-print">
                <div className="col-12">
                    <h1>Classements</h1>
                </div>
            </div>
            <div className="row hide-on-print">
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
                        maxRankingTime={86400 * 1000 /* TODO USE RACE DURATION */}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <RankingTable
                        ranking={processedRanking}
                        tableCategory={selectedCategory}
                        tableGender={selectedGender}
                        tableRaceDuration={selectedTimeMode === TimeMode.At ? selectedRankingTime : null}
                    />
                </div>
            </div>
        </div>
    );
}

export default Ranking;
