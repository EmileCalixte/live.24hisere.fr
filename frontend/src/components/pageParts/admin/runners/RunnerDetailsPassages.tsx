import {faEye, faEyeSlash, faPen, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useMemo, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {formatDateAsString, formatMsAsDuration} from "../../../../util/utils";
import RunnerDetailsCreatePassage from "./RunnerDetailsCreatePassage";
import RunnerDetailsEditPassage from "./RunnerDetailsEditPassage";

interface RunnerDetailsPassagesProps {
    passages: AdminProcessedPassage[];
    runnerRace: AdminRaceWithRunnerCount | null;
    updatePassageVisiblity: (passage: AdminProcessedPassage, hidden: boolean) => any;
    updatePassage: (passage: AdminProcessedPassage, time: Date) => any;
    saveNewPassage: (time: Date) => any;
    deletePassage: (passage: AdminProcessedPassage) => any;
}

export default function RunnerDetailsPassages({
    passages,
    runnerRace,
    updatePassageVisiblity,
    updatePassage,
    saveNewPassage,
    deletePassage,
}: RunnerDetailsPassagesProps) {
    const [isAdding, setIsAdding] = useState(false);

    // The passage for which user is currently editing the time
    const [editingPassage, setEditingPassage] = useState<AdminProcessedPassage | null>(null);

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

        if (editingPassage !== null || isAdding) {
            window.addEventListener("scroll", onScroll);
        }

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [editingPassage, isAdding]);

    return (
        <>
            <Row>
                {isAdding &&
                    <RunnerDetailsCreatePassage runnerRace={runnerRace}
                                                savePassage={saveNewPassage}
                                                onClose={() => setIsAdding(false)}
                    />
                }

                {editingPassage !== null &&
                    <RunnerDetailsEditPassage passage={editingPassage}
                                              runnerRace={runnerRace}
                                              updatePassage={updatePassage}
                                              onClose={() => setEditingPassage(null)}
                    />
                }

                <Col className="mb-3">
                    <button className="button" onClick={() => setIsAdding(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter manuellement
                    </button>

                </Col>
            </Row>

            <Row>
                <Col>
                    {passages.length === 0 &&
                        <p><i>Aucun passage</i></p>
                    }

                    {passages.length > 0 &&
                        <>
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
                                                <td>{formatDateAsString(passage.processed.lapEndTime)}</td>
                                                <td>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</td>
                                                <td className="no-padding-vertical">
                                                    <div className="buttons-container">
                                                        {passage.isHidden &&
                                                            <button className="button small"
                                                                    onClick={() => updatePassageVisiblity(passage, false)}
                                                            >
                                                                <FontAwesomeIcon icon={faEye} /> Ne plus masquer
                                                            </button>
                                                        }

                                                        {!passage.isHidden &&
                                                            <button className="button orange small"
                                                                    onClick={() => updatePassageVisiblity(passage, true)}
                                                            >
                                                                <FontAwesomeIcon icon={faEyeSlash} /> Masquer
                                                            </button>
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="button small"
                                                            onClick={() => setEditingPassage(passage)}
                                                    >
                                                        <FontAwesomeIcon icon={faPen} /> Modifier
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="button red small"
                                                            onClick={() => deletePassage(passage)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} /> Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    }
                </Col>
            </Row>
        </>
    );
}
