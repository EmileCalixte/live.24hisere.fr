import React from "react";
import RankingSettings from "./RankingSettings";
import ApiUtil from "../../../util/ApiUtil";
import RankingTable from "./RankingTable";

class Ranking extends React.Component {
    static CATEGORY_ALL = 'all';
    static CATEGORY_TEAM = 'team';

    static GENDER_MIXED = 'mixed';
    static GENDER_H = 'h';
    static GENDER_F = 'f';

    refreshRankingInterval = null;

    constructor(props) {
        super(props);

        this.state = {
            categories: false,
            ranking: [],
            selectedCategory: Ranking.CATEGORY_ALL,
            selectedGender: Ranking.GENDER_MIXED,
        }
    }

    componentDidMount = () => {
        this.fetchCategories();
        this.fetchRanking();

        this.refreshRankingInterval = setInterval(this.fetchRanking, 30000);
    }

    componentWillUnmount = () => {
        clearInterval(this.refreshRankingInterval);
    }

    fetchCategories = async () => {
        const response = await ApiUtil.performAPIRequest('/categories');
        const responseJson = await response.json();

        const categories = {};

        responseJson.categories.forEach((category) => {
            categories[category.code] = category.name;
        });

        this.setState({
            categories,
        });
    }

    fetchRanking = async () => {
        const response = await ApiUtil.performAPIRequest('/ranking');
        const responseJson = await response.json();

        // TODO process ranking and add missing fields (avg speed, ranking per gender, per category...)

        this.setState({
            ranking: responseJson.ranking,
        })
    }

    onCategorySelect = (e) => {
        this.setState({
            selectedCategory: e.target.value,
        });
    }

    onGenderSelect = (e) => {
        this.setState({
            selectedGender: e.target.value,
        });
    }

    render = () => {
        return(
            <div id="page-ranking">
                <div className="row">
                    <div className="col-12">
                        <h1>Classements</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <RankingSettings rankingComponent={this} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <RankingTable ranking={this.state.ranking} category={this.state.selectedCategory} gender={this.state.selectedGender} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Ranking;
