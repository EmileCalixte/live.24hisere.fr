import React from "react";
import { faEye, faEyeSlash, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Col, Row } from "react-bootstrap";
import type { AdminProcessedPassage, AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import type { ReactStateSetter } from "../../../../types/utils/react";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { formatDateAsString } from "../../../../utils/utils";
import { Button } from "../../../ui/forms/Button";
import RunnerDetailsCreatePassageDialog from "../runners/RunnerDetailsCreatePassage";
import RunnerDetailsEditPassageDialog from "../runners/RunnerDetailsEditPassage";

interface ParticipantDetailsPassagesProps {
  passages: AdminProcessedPassage[];
  runnerRace: AdminRaceWithRunnerCount | null;
  isAddingPassage: boolean;
  setIsAddingPassage: ReactStateSetter<boolean>;
  updatePassageVisiblity: (passage: AdminProcessedPassage, hidden: boolean) => unknown;
  updatePassage: (passage: AdminProcessedPassage, time: Date) => unknown;
  saveNewPassage: (time: Date) => unknown;
  deletePassage: (passage: AdminProcessedPassage) => unknown;
}

export default function ParticipantDetailsPassages({
  passages,
  runnerRace,
  isAddingPassage,
  setIsAddingPassage,
  updatePassageVisiblity,
  updatePassage,
  saveNewPassage,
  deletePassage,
}: ParticipantDetailsPassagesProps): React.ReactElement {
  // The passage for which user is currently editing the time
  const [editingPassage, setEditingPassage] = React.useState<AdminProcessedPassage | null>(null);

  const passageCount = React.useMemo(() => passages.length, [passages]);

  const hiddenPassageCount = React.useMemo(() => passages.filter((passage) => passage.isHidden).length, [passages]);

  React.useEffect(() => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    function onScroll(): void {
      window.scrollTo(scrollX, scrollY);
    }

    if (editingPassage !== null || isAddingPassage) {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [editingPassage, isAddingPassage]);

  return (
    <>
      <Row>
        {isAddingPassage && (
          <RunnerDetailsCreatePassageDialog
            runnerRace={runnerRace}
            savePassage={saveNewPassage}
            onClose={() => {
              setIsAddingPassage(false);
            }}
          />
        )}

        {editingPassage !== null && (
          <RunnerDetailsEditPassageDialog
            passage={editingPassage}
            runnerRace={runnerRace}
            updatePassage={updatePassage}
            onClose={() => {
              setEditingPassage(null);
            }}
          />
        )}
      </Row>

      <Row>
        <Col>
          {passages.length === 0 && (
            <p>
              <i>Aucun passage</i>
            </p>
          )}

          {passages.length > 0 && (
            <>
              <p>
                {passageCount} passage
                {passageCount >= 2 ? "s" : ""}
                {hiddenPassageCount > 0 && `, dont ${hiddenPassageCount} masqué${hiddenPassageCount >= 2 ? "s" : ""}`}
              </p>

              <table className="no-full-width admin-runner-passages-table table">
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
                  {passages.map((passage) => (
                    <tr key={passage.id} className={clsx(passage.isHidden && "passage-hidden")}>
                      <td className="text-xs">{passage.id}</td>
                      <td className="text-xs">
                        {(() => {
                          if (passage.detectionId !== null) {
                            let text = `Auto (${passage.detectionId})`;

                            if (passage.importTime !== null) {
                              text = `${text} (${formatDateAsString(new Date(passage.importTime))})`;
                            }

                            return text;
                          }

                          return "Manuel";
                        })()}
                      </td>
                      <td className={clsx(passage.isHidden && "line-through")}>
                        {formatDateAsString(passage.processed.lapEndTime)}
                      </td>
                      <td className={clsx(passage.isHidden && "line-through")}>
                        {formatMsAsDuration(passage.processed.lapEndRaceTime)}
                      </td>
                      <td>
                        {passage.isHidden ? (
                          <Button
                            size="sm"
                            icon={<FontAwesomeIcon icon={faEye} />}
                            onClick={() => {
                              void updatePassageVisiblity(passage, false);
                            }}
                          >
                            Ne plus masquer
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            color="orange"
                            icon={<FontAwesomeIcon icon={faEyeSlash} />}
                            onClick={() => {
                              void updatePassageVisiblity(passage, true);
                            }}
                          >
                            Masquer
                          </Button>
                        )}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          icon={<FontAwesomeIcon icon={faPen} />}
                          onClick={() => {
                            setEditingPassage(passage);
                          }}
                        >
                          Modifier
                        </Button>
                      </td>
                      <td>
                        <Button
                          color="red"
                          size="sm"
                          icon={<FontAwesomeIcon icon={faTrash} />}
                          onClick={() => {
                            void deletePassage(passage);
                          }}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
