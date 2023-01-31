import React from "react";
import {Race} from "../../../types/Race";
import OptionWithLoadingDots from "../../misc/OptionWithLoadingDots";
import RaceTimer from "../../misc/RaceTimer";

const RankingRaceSelector: React.FunctionComponent<{
    races: Race[] | false,
    onSelectRace: (e: React.ChangeEvent<HTMLSelectElement>) => any,
    selectedRaceId: number | undefined,
}> = ({races, onSelectRace, selectedRaceId}) => {
    return (
        <div className="ranking-race-selector-container">
            <div className="input-group">
                <label htmlFor="ranking-race-select">
                    Course
                </label>
                <select id="ranking-race-select"
                        className="input-select"
                        value={selectedRaceId !== undefined ? selectedRaceId : "_placeholder"}
                        onChange={onSelectRace}
                >
                    <option disabled hidden value="_placeholder">Sélectionnez une course</option>

                    {(() => {
                        if (races === false) {
                            return (
                                <OptionWithLoadingDots>
                                    Chargement des courses
                                </OptionWithLoadingDots>
                            );
                        }

                        return (
                            <>
                                {races.map(race => {
                                    return (
                                        <option key={race.id} value={race.id}>
                                            {race.name} | <RaceTimer race={race}/>
                                        </option>
                                    )
                                })}
                            </>
                        );
                    })()}
                </select>
            </div>
        </div>
    );
}

export default RankingRaceSelector;
