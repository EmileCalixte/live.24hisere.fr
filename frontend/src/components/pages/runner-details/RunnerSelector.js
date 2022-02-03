import OptionWithLoadingDots from "../../misc/OptionWithLoadingDots";
import {useCallback, useEffect, useState} from "react";

const RunnerSelector = ({runners, onSelectRunner}) => {
    const [idSortedRunners, setIdSortedRunners] = useState(false);
    const [nameSortedRunners, setNameSortedRunners] = useState(false);

    const sortRunners = useCallback(() => {
        if (runners === false) {
            return;
        }

        setIdSortedRunners([...runners].sort((a, b) => {
            const aId = parseInt(a.id);
            const bId = parseInt(b.id);

            if (aId < bId) {
                return -1;
            }

            if (aId > bId) {
                return 1;
            }

            return 0;
        }));

        setNameSortedRunners([...runners].sort((a, b) => {
            const aIsTeam = a.isTeam === '1';
            const bIsTeam = b.isTeam === '1';
            const aName = a.firstname + a.lastname;
            const bName = b.firstname + b.lastname;
            
            if (aIsTeam && !bIsTeam) {
                return -1;
            }

            if (!aIsTeam && bIsTeam) {
                return 1;
            }

            if (aName < bName) {
                return -1;
            }

            if (aName > bName) {
                return 1;
            }

            return 0;
        }));
    }, [runners]);

    useEffect(() => {
        sortRunners();
    }, [sortRunners]);

    console.log(runners);

    return(
        <div className="runner-details-runner-selector-container">
            <div className="input-group">
                <label htmlFor="runner-select">
                    Coureur
                </label>
                <select id="runner-select"
                        className="input-select"
                        onChange={onSelectRunner}
                >
                    <option selected disabled hidden>Sélectionnez un coureur</option>

                    {(() => {
                        if (idSortedRunners === false || nameSortedRunners === false) {
                            return (
                                <OptionWithLoadingDots>
                                    Chargement des coureurs
                                </OptionWithLoadingDots>
                            )
                        }

                        return (
                            <>
                                {idSortedRunners.map(runner => {
                                    return (
                                        <option key={runner.id} value={runner.id}>
                                            N° {runner.id} –  {runner.lastname} {runner.firstname}
                                        </option>
                                    )
                                })}

                                <option disabled />
                                <option disabled>—————</option>
                                <option disabled />

                                {nameSortedRunners.map(runner => {
                                    return (
                                        <option key={runner.id} value={runner.id}>
                                            {runner.lastname} {runner.firstname} – N° {runner.id}
                                        </option>
                                    )
                                })}
                            </>
                        );
                    })()}

                    {runners === false &&
                    <OptionWithLoadingDots>
                        Chargement des coureurs
                    </OptionWithLoadingDots>
                    }

                </select>
            </div>
        </div>
    )
}

export default RunnerSelector;
