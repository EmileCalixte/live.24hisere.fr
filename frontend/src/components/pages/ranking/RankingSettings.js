import React from "react";
import LoadingCategoriesOption from "./LoadingCategoriesOption";
import Ranking from "./Ranking";

class RankingSettings extends React.Component {
    render = () => {
        return(
            <section id="ranking-settings-section">
                <div id="ranking-settings-container">

                    <div className="ranking-settings">
                        <div className="input-group">
                            <label htmlFor="ranking-settings-category-select">
                                Catégorie
                            </label>
                            <select
                                id="ranking-settings-category-select"
                                value={this.props.rankingComponent.state.selectedCategory}
                                onChange={this.props.rankingComponent.onCategorySelect}
                                className="input-select"
                            >
                                <option value={Ranking.CATEGORY_ALL}>Scratch (toutes catégories)</option>
                                {this.renderCategoriesOptions()}
                                <option value={Ranking.CATEGORY_TEAM}>Équipes</option>
                            </select>
                        </div>
                    </div>

                    <div className="ranking-settings">
                        <legend>Genre</legend>

                        <div className="inline-input-group">
                            <label className="input-radio">
                                <input
                                    type="radio"
                                    defaultChecked={this.props.rankingComponent.state.selectedGender === Ranking.GENDER_MIXED}
                                    onChange={this.props.rankingComponent.onGenderSelect}
                                    name="gender"
                                    value={Ranking.GENDER_MIXED} />
                                <span/>
                                Mixte
                            </label>
                        </div>

                        <div className="inline-input-group">
                            <label className="input-radio">
                                <input
                                    type="radio"
                                    defaultChecked={this.props.rankingComponent.state.selectedGender === Ranking.GENDER_H}
                                    onChange={this.props.rankingComponent.onGenderSelect}
                                    name="gender"
                                    value={Ranking.GENDER_H} />
                                <span/>
                                Hommes
                            </label>
                        </div>

                        <div className="inline-input-group">
                            <label className="input-radio">
                                <input
                                    type="radio"
                                    defaultChecked={this.props.rankingComponent.state.selectedGender === Ranking.GENDER_F}
                                    onChange={this.props.rankingComponent.onGenderSelect}
                                    name="gender"
                                    value={Ranking.GENDER_F} />
                                <span/>
                                Femmes
                            </label>
                        </div>
                    </div>

                </div>
            </section>
        )
    }

    renderCategoriesOptions = () => {
        if (this.props.rankingComponent.state.categories === false) {
            return(
                <LoadingCategoriesOption/>
            );
        }

        const items = [];

        for (const [key, name] of Object.entries(this.props.rankingComponent.state.categories)) {
            items.push(<option key={key} value={key}>{name}</option>)
        }

        return (
            <>
                {items}
            </>
        );
    }
}

export default RankingSettings;
