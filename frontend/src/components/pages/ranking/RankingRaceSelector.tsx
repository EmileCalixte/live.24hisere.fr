import React from "react";

const RankingRaceSelector = () => {
    return (
        <div className="ranking-race-selector-container">
            <div className="input-group">
                <label htmlFor="ranking-race-select">
                    Course
                </label>
                <select id="ranking-race-select"
                        className="input-select"
                        value="_placeholder"
                >
                    <option disabled hidden value="_placeholder">Sélectionnez une course</option>
                </select>
            </div>
        </div>
    );
}

export default RankingRaceSelector;
