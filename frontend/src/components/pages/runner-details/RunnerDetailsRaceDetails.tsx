import React, {useEffect, useMemo, useState} from "react";
import {Race} from "../../../types/Race";
import Util from "../../../util/Util";
import {app} from "../../App";

const RunnerDetailsRaceDetails: React.FunctionComponent<{
    race: Race
}> = ({race}) => {
    // The current race time
    const [raceTime, setRaceTime] = useState(0);

    // The race total duration formatted to be human-readable
    const formattedRaceDuration = useMemo(() => {
        return Util.formatMsAsDuration(race.duration * 1000);
    }, [race]);

    const formattedRaceTime = useMemo(() => {
        return Util.formatMsAsDuration(raceTime);
    }, [raceTime]);

    useEffect(() => {
        const updateRaceTime = () => {
            const raceStartMs = new Date(race.startTime).getTime();
            const nowMs = (new Date()).getTime() + (app.state.serverTimeOffset * 1000);

            const raceTime = nowMs - raceStartMs;

            if (raceTime < 0) {
                setRaceTime(0);
                return;
            }

            if (raceTime > race.duration * 1000) {
                setRaceTime(race.duration * 1000);
                return;
            }

            setRaceTime(raceTime);
        };

        const interval = window.setInterval(updateRaceTime, 1000);

        updateRaceTime();

        return () => {
            window.clearInterval(interval);
        }
    }, [race]);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Course</h2>

                <p>{race.name}</p>

                <p><b>{formattedRaceTime}</b> / {formattedRaceDuration}</p>

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
