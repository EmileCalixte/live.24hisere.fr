import React, {useMemo} from "react";
import {Race} from "../../../types/Race";
import Util from "../../../util/Util";
import RaceTimer from "../../misc/RaceTimer";

const RunnerDetailsRaceDetails: React.FunctionComponent<{
    race: Race
}> = ({race}) => {
    // The race total duration formatted to be human-readable
    const formattedRaceDuration = useMemo(() => {
        return Util.formatMsAsDuration(race.duration * 1000);
    }, [race]);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Course</h2>

                <p>{race.name}</p>

                <p><b><RaceTimer race={race}/></b> / {formattedRaceDuration}</p>

                <p>
                    Distance tour : <strong>{race.lapDistance} m</strong> {race.initialDistance > 0 &&
                    <>
                        (distance avant le premier tour : {race.initialDistance} m)
                    </>
                    }
                </p>
            </div>
        </div>
    );
}

export default RunnerDetailsRaceDetails;
