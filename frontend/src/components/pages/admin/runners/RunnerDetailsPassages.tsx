import React, {useMemo, useState} from "react";
import {ProcessedPassage} from "../../../../types/Passage";
import Util from "../../../../util/Util";

const RunnerDetailsPassages: React.FunctionComponent<{
    passages: ProcessedPassage[]
}> = ({passages}) => {
    // TODO
    const [isAdding, setIsAdding] = useState(false);

    const passageCount = useMemo(() => passages.length, [passages]);

    return (
        <div className="row">
            <div className="col-12 mb-3">
                <button className="button" onClick={() => setIsAdding(true)}>
                    <i className="fa-solid fa-plus"/> Ajouter manuellement
                </button>


            </div>
            <div className="col-12">
                <p>{passageCount} passage{passageCount >= 2 ? "s" : ""}</p>

                <table className="table no-full-width">
                    <thead>
                    <tr>
                        <th>Date et heure</th>
                        <th>Temps de course</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {passages.map(passage => {
                        return (
                            <tr key={passage.id}>
                                <td>{Util.formatDateAsString(passage.processed.lapEndTime)}</td>
                                <td>{Util.formatMsAsDuration(passage.processed.lapEndRaceTime)}</td>
                                <td className="no-padding-vertical">
                                    <div className="buttons-container">
                                        <button className="button orange small">
                                            <i className="fa-solid fa-eye-slash"/> Masquer
                                        </button>
                                        <button className="button small">
                                            <i className="fa-solid fa-pen"/> Modifier
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RunnerDetailsPassages;
