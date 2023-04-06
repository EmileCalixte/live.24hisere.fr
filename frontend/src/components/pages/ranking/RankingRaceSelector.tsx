import React, {useMemo} from "react";
import {isRaceFinished, isRaceStarted} from "../../../helpers/raceHelper";
import {type Race} from "../../../types/Race";
import OptionWithLoadingDots from "../../misc/OptionWithLoadingDots";
import RaceTimer from "../../misc/RaceTimer";

interface RankingRaceSelectorProps {
    races: Race[] | false;
    onSelectRace: (e: React.ChangeEvent<HTMLSelectElement>) => any;
    selectedRaceId: number | undefined;
}

export default function RankingRaceSelector({races, onSelectRace, selectedRaceId}: RankingRaceSelectorProps) {
    const selectedRace = useMemo<Race | null>(() => {
        if (!races) return null;

        return races.find(race => race.id === selectedRaceId) ?? null;
    }, [races, selectedRaceId]);

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
                                            {race.name}
                                        </option>
                                    );
                                })}
                            </>
                        );
                    })()}
                </select>
            </div>
            {selectedRace && isRaceStarted(selectedRace) && !isRaceFinished(selectedRace) &&
                <b><RaceTimer race={selectedRace}/></b>
            }
        </div>
    );
}
