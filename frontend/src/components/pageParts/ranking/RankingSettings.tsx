import OptionWithLoadingDots from "../../forms/OptionWithLoadingDots";
import {TimeMode} from "../../pages/Ranking";
import RankingSettingsTime from "./RankingSettingsTime";
import React from "react";
import {type CategoriesDict, type CategoryShortCode} from "../../../types/Category";
import {Gender, type GenderWithMixed} from "../../../types/Runner";

interface RankingSettingsProps {
    categories: CategoriesDict | false;
    onCategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => any;
    onGenderSelect: (e: React.ChangeEvent<HTMLInputElement>) => any;
    onTimeModeSelect: (e: React.ChangeEvent<HTMLInputElement>) => any;
    onRankingTimeSave: (time: number) => any;
    selectedCategory: CategoryShortCode | null;
    selectedGender: GenderWithMixed;
    selectedTimeMode: TimeMode;
    currentRankingTime: number;
    maxRankingTime: number;
}

export default function RankingSettings({
    categories,
    onCategorySelect,
    onGenderSelect,
    onTimeModeSelect,
    onRankingTimeSave,
    selectedCategory,
    selectedGender,
    selectedTimeMode,
    currentRankingTime,
    maxRankingTime,
}: RankingSettingsProps) {
    return (
        <section id="ranking-settings-section">
            <div id="ranking-settings-container">

                <div className="ranking-settings">
                    <div className="input-group">
                        <label htmlFor="ranking-settings-category-select">
                            Catégorie
                        </label>
                        <select id="ranking-settings-category-select"
                                value={selectedCategory ?? "scratch"}
                                onChange={onCategorySelect}
                                className="input-select"
                        >
                            <option value="scratch">Scratch (toutes catégories)</option>
                            {(() => {
                                if (categories === false) {
                                    return (
                                        <OptionWithLoadingDots>
                                            Chargement des catégories
                                        </OptionWithLoadingDots>
                                    );
                                }

                                const items = [];

                                for (const [key, name] of Object.entries(categories)) {
                                    items.push(<option key={key} value={key}>{name}</option>);
                                }

                                return (
                                    <>
                                        {items}
                                    </>
                                );
                            })()}
                        </select>
                    </div>
                </div>

                <div className="ranking-settings">
                    <legend>Genre</legend>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input type="radio"
                                   defaultChecked={selectedGender === "mixed"}
                                   onChange={onGenderSelect}
                                   name="gender"
                                   value={"mixed"}
                            />
                            <span/>
                            Mixte
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input type="radio"
                                   defaultChecked={selectedGender === Gender.M}
                                   onChange={onGenderSelect}
                                   name="gender"
                                   value={Gender.M}
                            />
                            <span/>
                            Hommes
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input type="radio"
                                   defaultChecked={selectedGender === Gender.F}
                                   onChange={onGenderSelect}
                                   name="gender"
                                   value={Gender.F}
                            />
                            <span/>
                            Femmes
                        </label>
                    </div>
                </div>

                <div className="ranking-settings">
                    <legend>Heure</legend>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input type="radio"
                                   defaultChecked={selectedTimeMode === TimeMode.Now}
                                   onChange={onTimeModeSelect}
                                   name="time"
                                   value={TimeMode.Now}
                            />
                            <span/>
                            Classement actuel
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-radio">
                            <input type="radio"
                                   defaultChecked={selectedTimeMode === TimeMode.At}
                                   onChange={onTimeModeSelect}
                                   name="time"
                                   value={TimeMode.At}
                            />
                            <span/>
                            Au temps de course
                        </label>
                    </div>

                    <RankingSettingsTime isVisible={selectedTimeMode === TimeMode.At}
                                         currentRankingTime={currentRankingTime}
                                         onRankingTimeSave={onRankingTimeSave}
                                         maxRankingTime={maxRankingTime}
                    />
                </div>

            </div>
        </section>
    );
}
