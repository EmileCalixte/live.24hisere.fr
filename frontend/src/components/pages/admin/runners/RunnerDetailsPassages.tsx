import React, {useEffect, useMemo, useState} from "react";
import {AdminProcessedPassage} from "../../../../types/Passage";
import Util from "../../../../util/Util";
import RunnerDetailsPassageTimeForm from "./RunnerDetailsPassageTimeForm";

const RunnerDetailsPassages: React.FunctionComponent<{
    passages: AdminProcessedPassage[],
    updatePassageVisiblity: (passage: AdminProcessedPassage, hidden: boolean) => any,
    deletePassage: (passage: AdminProcessedPassage) => any,
}> = ({passages, updatePassageVisiblity, deletePassage}) => {
    // TODO
    const [isAdding, setIsAdding] = useState(false);

    // The passage for which user is currently editing the time
    const [editingPassageTime, setEditingPassageTime] = useState<AdminProcessedPassage | null>(null);

    const passageCount = useMemo(() => passages.length, [passages]);

    const hiddenPassageCount = useMemo(() => {
        return passages.filter(passage => passage.isHidden).length;
    }, [passages]);

    useEffect(() => {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        function onScroll() {
            window.scrollTo(scrollX, scrollY);
        }

        if (editingPassageTime !== null) {
            window.addEventListener("scroll", onScroll);
        }

        return (() => {
            window.removeEventListener("scroll", onScroll);
        })
    }, [editingPassageTime]);

    return (
        <div className="row">
            {editingPassageTime !== null &&
            <RunnerDetailsPassageTimeForm onClose={() => setEditingPassageTime(null)}
            />
            }

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
                                        <button className="button small"
                                                onClick={() => updatePassageVisiblity(passage, false)}
                                        >
                                            <i className="fa-solid fa-eye"/> Ne plus masquer
                                        </button>
                                        }

                                        {!passage.isHidden &&
                                        <button className="button orange small"
                                                onClick={() => updatePassageVisiblity(passage, true)}
                                        >
                                            <i className="fa-solid fa-eye-slash"/> Masquer
                                        </button>
                                        }
                                    </div>
                                </td>
                                <td>
                                    <button className="button small"
                                            onClick={() => setEditingPassageTime(passage)}
                                    >
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
