import LoadingCategoriesOption from "./LoadingCategoriesOption";
import {CATEGORY_ALL, CATEGORY_TEAM, GENDER_F, GENDER_M, GENDER_MIXED} from "./Ranking";

const RankingSettings = ({categories, onCategorySelect, onGenderSelect, selectedCategory, selectedGender}) => {
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
                            value={selectedCategory}
                            onChange={onCategorySelect}
                            className="input-select"
                        >
                            <option value={CATEGORY_ALL}>Scratch (toutes catégories)</option>
                            {(() => {
                                if (categories === false) {
                                    return(
                                        <LoadingCategoriesOption/>
                                    );
                                }

                                const items = [];

                                for (const [key, name] of Object.entries(categories)) {
                                    items.push(<option key={key} value={key}>{name}</option>)
                                }

                                return (
                                    <>
                                        {items}
                                    </>
                                );
                            })()}
                            <option value={CATEGORY_TEAM}>Équipes</option>
                        </select>
                    </div>
                </div>

                <div className="ranking-settings">
                    <legend>Genre</legend>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input
                                type="radio"
                                defaultChecked={selectedGender === GENDER_MIXED}
                                onChange={onGenderSelect}
                                name="gender"
                                value={GENDER_MIXED} />
                            <span/>
                            Mixte
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input
                                type="radio"
                                defaultChecked={selectedGender === GENDER_M}
                                onChange={onGenderSelect}
                                name="gender"
                                value={GENDER_M} />
                            <span/>
                            Hommes
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input
                                type="radio"
                                defaultChecked={selectedGender === GENDER_F}
                                onChange={onGenderSelect}
                                name="gender"
                                value={GENDER_F} />
                            <span/>
                            Femmes
                        </label>
                    </div>
                </div>

                <div className="ranking-settings">
                    <legend>Heure</legend>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input
                                type="radio"
                                defaultChecked={true}
                                // onChange={this.props.rankingComponent.onGenderSelect}
                                name="time"
                                value="current" />
                            <span/>
                            Classement actuel
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input
                                type="radio"
                                // defaultChecked={this.props.rankingComponent.state.selectedGender === Ranking.GENDER_M}
                                // onChange={this.props.rankingComponent.onGenderSelect}
                                name="time"
                                value="atTime" />
                            <span/>
                            À l'heure
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input
                                type="radio"
                                // defaultChecked={this.props.rankingComponent.state.selectedGender === Ranking.GENDER_F}
                                // onChange={this.props.rankingComponent.onGenderSelect}
                                name="time"
                                value="atRaceDuration" />
                            <span/>
                            Au temps de course
                        </label>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default RankingSettings;
