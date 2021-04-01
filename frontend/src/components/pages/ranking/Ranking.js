import React from "react";
import RankingSettings from "./RankingSettings";
import ApiUtil from "../../../util/ApiUtil";

class Ranking extends React.Component {
    static CATEGORY_ALL = 'all';
    static CATEGORY_TEAM = 'team';

    static GENDER_MIXED = 'mixed';
    static GENDER_H = 'h';
    static GENDER_F = 'f';

    constructor(props) {
        super(props);

        this.state = {
            categories: false,
            selectedCategory: Ranking.CATEGORY_ALL,
            selectedGender: Ranking.GENDER_MIXED,
        }
    }

    componentDidMount = async () => {
        await this.fetchCategories();
    }

    fetchCategories = async () => {
        const response = await ApiUtil.performAPIRequest('/categories');
        const responseJson = await response.json();

        this.setState({
            categories: responseJson.categories
        });
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
            </div>
        )
    }
}

export default Ranking;
