import React from "react";
import RankingSettings from "./RankingSettings";
import ApiUtil from "../../../util/ApiUtil";

class Ranking extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: false,
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
                        <RankingSettings categories={this.state.categories} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Ranking;
