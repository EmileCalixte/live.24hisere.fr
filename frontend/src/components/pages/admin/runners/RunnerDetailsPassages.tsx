import React, {useMemo, useState} from "react";
import {AdminProcessedPassage} from "../../../../types/Passage";
import Util from "../../../../util/Util";

const RunnerDetailsPassages: React.FunctionComponent<{
    passages: AdminProcessedPassage[],
    deletePassage: (passage: AdminProcessedPassage) => any,
}> = ({passages, deletePassage}) => {
    // TODO
    const [isAdding, setIsAdding] = useState(false);

    const passageCount = useMemo(() => passages.length, [passages]);

    const hiddenPassageCount = useMemo(() => {
        return passages.filter(passage => passage.isHidden).length;
    }, [passages]);

    return (
        <div className="row">
            <div className="col-12 mb-3">
                <button className="button" onClick={() => setIsAdding(true)}>
                    <i className="fa-solid fa-plus"/> Ajouter manuellement
                </button>


            </div>
            <div className="col-12">
                <p>
                    {passageCount} passage{passageCount >= 2 ? "s" : ""}

                    {hiddenPassageCount > 0 &&
                        `, dont ${hiddenPassageCount} masqué${hiddenPassageCount >= 2 ? "s" : ""}`
                    }
                </p>

                <table className="table no-full-width">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Date et heure</th>
                        <th>Temps de course</th>
                        <th colSpan={3}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {passages.map(passage => {
                        return (
                            <tr key={passage.id}>
                                <td style={{fontSize: "0.85em"}}>{passage.id}</td>
                                <td style={{fontSize: "0.85em"}}>
                                    {(() => {
                                        if (passage.detectionId !== null) {
                                            return `Auto (${passage.detectionId})`;
                                        }

                                        return "Manuel";
                                    })()}
                                </td>
                                <td>{Util.formatDateAsString(passage.processed.lapEndTime)}</td>
                                <td>{Util.formatMsAsDuration(passage.processed.lapEndRaceTime)}</td>
                                <td className="no-padding-vertical">
                                    <div className="buttons-container">
                                        {passage.isHidden &&
                                        <button className="button small">
                                            <i className="fa-solid fa-eye"/> Ne plus masquer
                                        </button>
                                        }

                                        {!passage.isHidden &&
                                        <button className="button orange small">
                                            <i className="fa-solid fa-eye-slash"/> Masquer
                                        </button>
                                        }
                                    </div>
                                </td>
                                <td>
                                    <button className="button small">
                                        <i className="fa-solid fa-pen"/> Modifier
                                    </button>
                                </td>
                                <td>
                                    <button className="button red small"
                                            onClick={() => deletePassage(passage)}
                                    >
                                        <i className="fa-solid fa-trash"/> Supprimer
                                    </button>
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
