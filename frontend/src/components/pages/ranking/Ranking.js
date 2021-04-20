import '../../../css/print-ranking-table.css';
import {useState, useEffect} from "react";
import RankingSettings from "./RankingSettings";
import ApiUtil from "../../../util/ApiUtil";
import RankingTable from "./RankingTable";
import RankingUtil from "../../../util/RankingUtil";

export const CATEGORY_ALL = 'all';
export const CATEGORY_TEAM = 'team';

export const GENDER_MIXED = 'mixed';
export const GENDER_M = 'm';
export const GENDER_F = 'f';

export const RANKING_UPDATE_INTERVAL_TIME = 30000;

const Ranking = () => {
    const [categories, setCategories] = useState(false);
    const [ranking, setRanking] = useState([]);
    const [processedRanking, setProcessedRanking] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL);
    const [selectedGender, setSelectedGender] = useState(GENDER_MIXED);

    const fetchCategories = async () => {
        const response = await ApiUtil.performAPIRequest('/categories');
        const responseJson = await response.json();

        const responseCategories = {};

        responseJson.categories.forEach((category) => {
            responseCategories[category.code] = category.name;
        });

        setCategories(() => responseCategories);
    }

    const fetchRanking = async () => {
        const response = await ApiUtil.performAPIRequest('/ranking');
        const responseJson = await response.json();

        setRanking(() => responseJson.ranking);
        setProcessedRanking(() => RankingUtil.getProcessedRanking(responseJson.ranking));
    }

    const onCategorySelect = (e) => {
        console.log(e.target.value);
        setSelectedCategory(() => e.target.value);
    }

    const onGenderSelect = (e) => {
        console.log(e.target.value);
        setSelectedGender(() => e.target.value);
    }

    useEffect(() => {
        fetchCategories();
        fetchRanking();

        const refreshRankingInterval = setInterval(fetchRanking, RANKING_UPDATE_INTERVAL_TIME);

        return (() => clearInterval(refreshRankingInterval));
    }, []);

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
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <RankingTable ranking={processedRanking} tableCategory={selectedCategory} tableGender={selectedGender} />
                </div>
            </div>
        </div>
    );
}

export default Ranking;
