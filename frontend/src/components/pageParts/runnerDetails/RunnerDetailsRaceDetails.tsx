import { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { type Race } from "../../../types/Race";
import { formatMsAsDuration } from "../../../util/utils";
import RaceTimer from "../RaceTimer";

interface RunnerDetailsRaceDetailsProps {
    race: Race;
}

export default function RunnerDetailsRaceDetails({ race }: RunnerDetailsRaceDetailsProps): JSX.Element {
    const raceInitialDistance = Number(race.initialDistance);
    const raceLapDistance = Number(race.lapDistance);

    // The race total duration formatted to be human-readable
    const formattedRaceDuration = useMemo(() => {
        return formatMsAsDuration(race.duration * 1000);
    }, [race]);

    return (
        <Row>
            <Col>
                <h2>Course</h2>

                <p>{race.name}</p>

                <p><b><RaceTimer race={race} /></b> / {formattedRaceDuration}</p>

                <p>
                    Distance tour : <strong>{raceLapDistance} m</strong>
                    <> </>
                    {raceInitialDistance > 0 &&
                        <>
                            (distance avant le premier tour : {raceInitialDistance} m)
                        </>
                    }
                </p>
            </Col>
        </Row>
    );
}
