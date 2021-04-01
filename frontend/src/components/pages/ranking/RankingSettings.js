import React from "react";
import LoadingCategoriesOption from "./LoadingCategoriesOption";

class RankingSettings extends React.Component {
    render = () => {
        return(
            <section id="ranking-settings-section">
                <h2>Filtres</h2>
                <div id="ranking-settings-container">

                    <div className="ranking-settings">
                        <div className="input-group">
                            <label htmlFor="ranking-settings-category-select">
                                Catégorie
                            </label>
                            <select id="ranking-settings-category-select" defaultValue="all" className="input-select">
                                <option value="all">Scratch (toutes catégories)</option>
                                {this.renderCategoriesOptions()}
                            </select>
                        </div>
                    </div>

                    <div className="ranking-settings">
                        <legend>Genre</legend>

                        <div className="inline-input-group">
                            <label className="input-radio">
                                <input defaultChecked={true} type="radio" id="ranking-settings-gender-mixed-radio" name="gender" value="mixed" />
                                <span/>
                                Mixte
                            </label>
                        </div>

                        <div className="inline-input-group">
                            <label className="input-radio">
                                <input type="radio" name="gender" value="h" />
                                <span/>
                                Hommes
                            </label>
                        </div>

                        <div className="inline-input-group">
                            <label className="input-radio">
                                <input type="radio" name="gender" value="f" />
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
        if (this.props.categories === false) {
            return(
                <LoadingCategoriesOption/>
            );
        }

        const items = [];

        for (const [key, name] of Object.entries(this.props.categories)) {
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
