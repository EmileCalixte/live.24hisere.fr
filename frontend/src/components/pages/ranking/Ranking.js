import '../../../css/print-ranking-table.css';
import {useState, useEffect, useCallback} from "react";
import RankingSettings from "./RankingSettings";
import ApiUtil from "../../../util/ApiUtil";
import RankingTable from "./RankingTable";
import RankingUtil from "../../../util/RankingUtil";
import {getMaxTime as getMaxRankingTime} from "./RankingSettingsTime";
import {app} from "../../App";
import Util from "../../../util/Util";

export const CATEGORY_ALL = 'all';
export const CATEGORY_TEAM = 'team';

export const GENDER_MIXED = 'mixed';
export const GENDER_M = 'm';
export const GENDER_F = 'f';

export const TIME_MODE_NOW = 'now';
export const TIME_MODE_AT = 'at';

export const RANKING_UPDATE_INTERVAL_TIME = 30000;

const Ranking = () => {

    const [categories, setCategories] = useState(false);
    const [processedRanking, setProcessedRanking] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL);
    const [selectedGender, setSelectedGender] = useState(GENDER_MIXED);
    const [selectedTimeMode, setSelectedTimeMode] = useState(TIME_MODE_NOW);
    const [selectedRankingTime, setSelectedRankingTime] = useState(getMaxRankingTime());

    const fetchCategories = async () => {
        const response = await ApiUtil.performAPIRequest('/categories');
        const responseJson = await response.json();

        const responseCategories = {};

        responseJson.categories.forEach((category) => {
            responseCategories[category.code] = category.name;
        });

        setCategories(responseCategories);
    }

    const fetchRanking = useCallback(async (rankingTime = selectedRankingTime) => {
        let requestUrl = '/ranking';

        if (selectedTimeMode === TIME_MODE_AT) {
            const rankingDate = new Date();
            rankingDate.setTime(app.state.raceStartTime.getTime() + rankingTime);
            const rankingDateString = Util.formatDateForApi(rankingDate);
            requestUrl += `?at=${rankingDateString}`;
        }

        const response = await ApiUtil.performAPIRequest(requestUrl);
        const responseJson = await response.json();

        setProcessedRanking(RankingUtil.getProcessedRanking(responseJson.ranking));
    }, [selectedRankingTime, selectedTimeMode]);

    const onCategorySelect = (e) => {
        setSelectedCategory(e.target.value);
    }

    const onGenderSelect = (e) => {
        setSelectedGender(e.target.value);
    }

    const onTimeModeSelect = (e) => {
        setSelectedTimeMode(e.target.value);
    }

    /**
     * @param time The new ranking time from race start in ms
     */
    const onRankingTimeSelect = async (time) => {
        setSelectedRankingTime(time);
    }

    useEffect(() => {
        fetchCategories();
        fetchRanking();

        const refreshRankingInterval = setInterval(fetchRanking, RANKING_UPDATE_INTERVAL_TIME);
        return (() => clearInterval(refreshRankingInterval));
    }, [fetchRanking]);

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
                        rankingComponent={this}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategorySelect={onCategorySelect}
                        selectedGender={selectedGender}
                        onGenderSelect={onGenderSelect}
                        selectedTimeMode={selectedTimeMode}
                        onTimeModeSelect={onTimeModeSelect}
                        onRankingTimeSelect={onRankingTimeSelect}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <RankingTable
                        ranking={processedRanking}
                        tableCategory={selectedCategory}
                        tableGender={selectedGender}
                        tableRaceDuration={selectedTimeMode === TIME_MODE_AT ? selectedRankingTime : null}
                    />
                </div>
            </div>
        </div>
    );
}

export default Ranking;
